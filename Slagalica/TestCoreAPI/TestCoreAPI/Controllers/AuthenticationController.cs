using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Img.ELicensing.Core;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TestCoreAPI.Dtos;
using TestCoreAPI.IServices;
using TestCoreAPI.Models;

namespace TestCoreAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IUserService _userService;
        private IMapper _mapper;
        private readonly ApplicationSettings _appSettings;

        public AuthenticationController(
            IMapper mapper,
            IUserService userService,
            IOptions<ApplicationSettings> applicationSettings)
        {
            _mapper = mapper;
            _userService = userService;
            _appSettings = applicationSettings.Value;
        }

        [HttpPost]
        [Route("Register")]
        //POST : /api/Registration/Register
        public async Task<IActionResult> PostApplicationUser(UserDto userDto)
        {
            var result = await _userService.Insert(userDto);
            return result.IsSuccess ? (IActionResult)Ok(result) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("ChangePass")]
        public async Task<IActionResult> ChangePass(ChangePassDto changePassDto)
        {
            var result = await _userService.ChangePassword(changePassDto);
            return result.IsSuccess ? (IActionResult)Ok(result) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("Login")]
        //POST : /api/Registration/Login
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            ResponseWrapper<UserDto> result = await _userService.FindByUsernameAsync(loginDto.Email, loginDto.Password);
            if (result.IsSuccess)
            {
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserID", result.Data.Id.ToString()),
                        new Claim("UserType", result.Data.TipKorisnika.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(120),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_appSettings.JWT_Secret)), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
            {
                return BadRequest(result.Errors);
            }
        }

        [HttpGet]
        public async Task<IActionResult> ConfirmRegistration([FromQuery]string userId, [FromQuery]string token)
        {
            var result = await _userService.CheckTokenForUser(userId, token);
            return result.IsSuccess ? (IActionResult)Ok(result) : BadRequest(result.Errors);
        }
    }
}
