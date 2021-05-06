using AutoMapper;
using Img.ELicensing.Core;
using Microsoft.EntityFrameworkCore;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using TestCoreAPI.ApplicationConstants;
using TestCoreAPI.IServices;
using TestCoreAPI.Models;

namespace TestCoreAPI.Services
{
    public class UserService : IUserService
    {
        private ApplicationDbContext _context;
        private IMapper _mapper;
        private IMailService _emailService;
        public UserService(
            ApplicationDbContext context, 
            IMapper mapper, 
            IMailService emailService)
        {
            _emailService = emailService;
            _context = context;
            _mapper = mapper;
        }
        public async Task<ResponseWrapper<List<UserDto>>> GetAll()
        {
            List<User> resultDB = await _context.Users.ToListAsync();
            if(resultDB != null)
            {
                var result = _mapper.Map<List<UserDto>>(resultDB);
                return ResponseWrapper<List<UserDto>>.Success(result);
            }

            return ResponseWrapper<List<UserDto>>.Error(AppConstants.NoUsersInDB);
        }
        public async Task<ResponseWrapper<UserDto>> GetById(Guid id)
        {
            var resultDB = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if(resultDB != null)
            {
                var result = _mapper.Map<UserDto>(resultDB);
                return ResponseWrapper<UserDto>.Success(result);
            }

            return ResponseWrapper<UserDto>.Error(AppConstants.NoSuchUser);
        }
        
        public async Task<ResponseWrapper<UserDto>> Insert(UserDto user)
        {
            try
            {
                bool usernameExist = _context.Users.Any(x => x.Username.Equals(user.Username));
                if (usernameExist)
                {
                    return ResponseWrapper<UserDto>.Error(AppConstants.UsernameAlreadyExist);
                }

                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

                User userDB = _mapper.Map<User>(user);
                userDB.Id = Guid.NewGuid();
                userDB.PasswordHash = passwordHash;
                userDB.PasswordSalt = passwordSalt;
                _context.Users.Add(userDB);
                await _context.SaveChangesAsync();
                user = _mapper.Map<UserDto>(userDB);

                var confirmation = new UserRegistrationConfirmation();
                confirmation.UserId = userDB.Id;
                confirmation.Token = Guid.NewGuid();
                confirmation.TokenExpirationTime = DateTime.UtcNow.AddSeconds(180);
                _context.UserRegistrationConfirmations.Add(confirmation);
                await _context.SaveChangesAsync();

                var userId = userDB.Id.ToString();
                var token = confirmation.Token.ToString();

                Response emailSendingResponse = await CreateNewEmailAndSend(user.Email, userId, token);
                if (emailSendingResponse.StatusCode != HttpStatusCode.Accepted)
                {
                    return ResponseWrapper<UserDto>.Error(AppConstants.ConfirmationEmailFailedToSend);
                }

                return ResponseWrapper<UserDto>.Success(user);
            }
            catch (Exception)
            {
                return ResponseWrapper<UserDto>.Error(AppConstants.ErrorSavingUser);
            }
        }

        public async Task<ResponseWrapper<UserDto>> Update(UserDto user)
        {
            try
            {
                var userDB = _mapper.Map<User>(user);
                _context.Users.Update(userDB);
                await _context.SaveChangesAsync();
                return ResponseWrapper<UserDto>.Success(user);
            }
            catch (Exception)
            {
                return ResponseWrapper<UserDto>.Error(AppConstants.ErrorUpdatingUser);
            }
        }

        public async Task<ResponseWrapper<UserDto>> FindByUsernameAsync(string username, string password)
        {
            var userDB = await _context.Users
                .FirstOrDefaultAsync(x => x.Username.Equals(username));

            if(userDB != null)
            {
                if (!VerifyPassword(password, userDB.PasswordHash, userDB.PasswordSalt))
                {
                    return ResponseWrapper<UserDto>.Error(AppConstants.WrongUsernameOrPassword);
                }

                if (!userDB.IsAccountActivated)
                {
                    return ResponseWrapper<UserDto>.Error(AppConstants.PleaseActivateAccount);
                }

                var user = _mapper.Map<UserDto>(userDB);   //menjaj ovo da ne vracas password
                return ResponseWrapper<UserDto>.Success(user);
            }

            return ResponseWrapper<UserDto>.Error(AppConstants.WrongUsernameOrPassword);
        }

        public async Task<ResponseWrapper<bool>> CheckTokenForUser(string userId, string token)
        {
            try
            {
                UserRegistrationConfirmation confirmation = 
                    await _context.UserRegistrationConfirmations
                          .FirstOrDefaultAsync(x => x.UserId.ToString() == userId && x.Token.ToString() == token);

                if (confirmation != null)
                {
                    if (confirmation.TokenExpirationTime < DateTime.UtcNow)
                    {
                        var userDB = await _context.Users.FirstOrDefaultAsync(x => x.Id.ToString() == userId);
                        confirmation.Token = Guid.NewGuid();
                        confirmation.TokenExpirationTime = DateTime.UtcNow.AddSeconds(30);
                        _context.UserRegistrationConfirmations.Update(confirmation);
                        await _context.SaveChangesAsync();

                        var response = await CreateNewEmailAndSend(userDB.Email, userId, confirmation.Token.ToString());
                        if (response.StatusCode != HttpStatusCode.Accepted)
                        {
                            return ResponseWrapper<bool>.Error(AppConstants.ConfirmationEmailFailedToSend);
                        }

                        return ResponseWrapper<bool>.Error(AppConstants.TokenExpired);
                    }

                    User user = await _context.Users.FirstOrDefaultAsync(x => x.Id.ToString() == userId);
                    if (user != null)
                    {
                        user.IsAccountActivated = true;
                        _context.Users.Update(user);
                        await _context.SaveChangesAsync();
                    }

                    return ResponseWrapper<bool>.Success(true);
                }

                return ResponseWrapper<bool>.Error(AppConstants.NoUserTokenMatch);
            }
            catch (Exception)
            {
                return ResponseWrapper<bool>.Error(AppConstants.ErrorConfirmingRegistration);
            }
        }

        private async Task<Response> CreateNewEmailAndSend(string userEmail, string userId, string token)
        {
            string emailHTMLTemplate = AppConstants.EmailTemplate.Replace("CONFIRMBUTTON", AppConstants.ConfirmRegistration)
                                                                                 .Replace("CONFIRMURL", AppConstants.UserRegistrationConfirmURL
                                                                                                                    .Replace("USERID", userId)
                                                                                                                    .Replace("TOKEN", token));

            Response emailSendingResponse = await _emailService.SendEmailAsync(userEmail, "Confirm Registration", emailHTMLTemplate);
            return emailSendingResponse;
        }

        private bool VerifyPassword(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)); // Create hash using password salt.
                for (int i = 0; i < computedHash.Length; i++)
                { // Loop through the byte array
                    if (computedHash[i] != passwordHash[i]) return false; // if mismatch
                }
            }

            return true; //if no mismatches.
        }

        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        //void Delete(User user);
    }
}
