﻿using AutoMapper;
using Img.ELicensing.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SendGrid;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using TestCoreAPI.ApplicationConstants;
using TestCoreAPI.Dtos;
using TestCoreAPI.IServices;
using TestCoreAPI.Models;

namespace TestCoreAPI.Services
{
    public class UserService : IUserService
    {
        private ApplicationDbContext _context;
        private IMapper _mapper;
        public UserService(
            ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ResponseWrapper<BestUsersDto>> GetBestUsers()
        {
            try
            {
                List<BestUserDto> rank7days = await _context.DailyGamePlays
                     .Where(x => x.DailyGameDate >= DateTime.Today.AddDays(-7) && x.DailyGameDate <= DateTime.Today)
                     .Select(x => new
                     {
                         x.User.KorisnickoIme,
                         x.Points,
                     })
                    .GroupBy(p => p.KorisnickoIme, x => x.Points)
                    .Select(g => new BestUserDto
                    {
                        UserName = g.Key,
                        AveragePointsPerGame = g.Sum() / 7, //g.Average(),
                        TotalPoints = g.Sum()
                    }).OrderByDescending(x => x.AveragePointsPerGame).Take(10).ToListAsync();

                var firstDayInCurrentMonth = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                List<BestUserDto> rankCurrentMonth = await _context.DailyGamePlays
                    .Where(x => x.DailyGameDate >= firstDayInCurrentMonth && x.DailyGameDate <= DateTime.Today)
                    .Select(x => new
                    {
                        x.User.KorisnickoIme,
                        x.Points,
                    })
                    .GroupBy(p => p.KorisnickoIme, x => x.Points)
                    .Select(g => new BestUserDto
                    {
                        UserName = g.Key,
                        AveragePointsPerGame = g.Sum() / DateTime.Now.Day, //g.Average(),
                        TotalPoints = g.Sum()
                    }).OrderByDescending(x => x.AveragePointsPerGame).Take(10).ToListAsync();

                var bestUsersRankings = new BestUsersDto();
                bestUsersRankings.Rank7Days = new List<BestUserDto>();
                bestUsersRankings.RankCurrentMonth = new List<BestUserDto>();
                if (rank7days != null && rankCurrentMonth != null)
                {
                    bestUsersRankings.Rank7Days = rank7days;
                    bestUsersRankings.RankCurrentMonth = rankCurrentMonth;
                }

                return ResponseWrapper<BestUsersDto>.Success(bestUsersRankings);
            }
            catch (Exception)
            {
                return ResponseWrapper<BestUsersDto>.Error(AppConstants.RanksError);
            }
        }

        public async Task<ResponseWrapper<UserDto>> GetById(Guid id)
        {
            var resultDB = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (resultDB != null)
            {
                var result = _mapper.Map<UserDto>(resultDB);
                return ResponseWrapper<UserDto>.Success(result);
            }

            return ResponseWrapper<UserDto>.Error(AppConstants.NoSuchUser);
        }

        public async Task<ResponseWrapper<UserDto>> ChangePassword(ChangePassDto changePassDto)
        {
            try
            {
                var userDB = await _context.Users
                .FirstOrDefaultAsync(x => x.Email.Equals(changePassDto.Email));

                if (userDB != null)
                {
                    if (!VerifyPassword(changePassDto.StariPassword, userDB.PasswordHash, userDB.PasswordSalt))
                    {
                        return ResponseWrapper<UserDto>.Error(AppConstants.WrongOldPassword);
                    }

                    byte[] passwordHash, passwordSalt;
                    CreatePasswordHash(changePassDto.NoviPassword, out passwordHash, out passwordSalt);

                    userDB.PasswordHash = passwordHash;
                    userDB.PasswordSalt = passwordSalt;
                    _context.Users.Update(userDB);
                    await _context.SaveChangesAsync();

                    var user = _mapper.Map<UserDto>(userDB);
                    return ResponseWrapper<UserDto>.Success(user);
                }

                return ResponseWrapper<UserDto>.Error(AppConstants.UserDoesNotExist);
            }
            catch (Exception)
            {
                return ResponseWrapper<UserDto>.Error(AppConstants.ErrorChangingPass);
            }
        }

        public async Task<ResponseWrapper<UserDto>> Insert(UserDto user, IFormCollection data, IHostingEnvironment environment)
        {
            try
            {
                if (data.Files != null && data.Files.Count > 0 && data.Files[0] != null)
                {
                    IFormFile postedFile = data.Files[0];
                    using (var memoryStream = new MemoryStream())
                    {
                        await postedFile.CopyToAsync(memoryStream);
                        using (Image img = Image.FromStream(memoryStream))
                        {
                            if (img.Size.Height > 300 || img.Size.Width > 300)
                            {
                                return ResponseWrapper<UserDto>.Error(AppConstants.ImageSizeTooBig);
                            }
                        }
                    }
                }
                bool usernameExist = _context.Users.Any(x => x.KorisnickoIme.Equals(user.KorisnickoIme) || x.Email.Equals(user.Email));
                if (usernameExist)
                {
                    return ResponseWrapper<UserDto>.Error(AppConstants.UsernameAlreadyExist);
                }

                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(user.Sifra, out passwordHash, out passwordSalt);

                User userDB = _mapper.Map<User>(user);
                userDB.Id = Guid.NewGuid();
                userDB.PasswordHash = passwordHash;
                userDB.PasswordSalt = passwordSalt;
                _context.Users.Add(userDB);
                await _context.SaveChangesAsync();
                user = _mapper.Map<UserDto>(userDB);
                if(data.Files != null && data.Files.Count > 0 && data.Files[0] != null)
                {
                    var delimitedPath = environment.ContentRootPath.Split(new string[] { @"\" }, StringSplitOptions.None).ToList();
                    delimitedPath.RemoveAt(delimitedPath.Count - 1);
                    delimitedPath.RemoveAt(delimitedPath.Count - 1);
                    delimitedPath.Add("Angular Front");
                    delimitedPath.Add("src");
                    delimitedPath.Add("assets");
                    delimitedPath.Add("images");
                    IFormFile postedFileSave = data.Files[0];
                    var imgExtension = postedFileSave.FileName.Substring(postedFileSave.FileName.LastIndexOf('.') + 1);
                    var newPhotoName = "assets/images/" + userDB.Id.ToString() + "." + imgExtension;
                    userDB.ProfilnaSlika = newPhotoName;
                    _context.Users.Update(userDB);
                    await _context.SaveChangesAsync();

                    var path = string.Join(@"\", delimitedPath);
                    using (FileStream stream = new FileStream(Path.Combine(path, userDB.Id.ToString() + "." + imgExtension), FileMode.Create))
                    {
                        postedFileSave.CopyTo(stream);
                    }
                }
                
                var userId = userDB.Id.ToString();
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

        public async Task<ResponseWrapper<UserDto>> FindByUsernameAsync(string email, string password)
        {
            var userDB = await _context.Users
                .FirstOrDefaultAsync(x => x.Email.Equals(email));

            if (userDB != null)
            {
                if (!VerifyPassword(password, userDB.PasswordHash, userDB.PasswordSalt))
                {
                    return ResponseWrapper<UserDto>.Error(AppConstants.WrongUsernameOrPassword);
                }

                if (!userDB.NalogAktiviran)
                {
                    return ResponseWrapper<UserDto>.Error(AppConstants.PleaseActivateAccount);
                }

                var user = _mapper.Map<UserDto>(userDB);
                return ResponseWrapper<UserDto>.Success(user);
            }

            return ResponseWrapper<UserDto>.Error(AppConstants.WrongUsernameOrPassword);
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
