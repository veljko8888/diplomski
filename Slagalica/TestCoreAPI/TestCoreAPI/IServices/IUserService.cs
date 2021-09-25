using Img.ELicensing.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.Dtos;
using TestCoreAPI.Models;

namespace TestCoreAPI.IServices
{
    public interface IUserService
    {
        Task<ResponseWrapper<BestUsersDto>> GetBestUsers();
        Task<ResponseWrapper<UserDto>> GetById(Guid id);
        Task<ResponseWrapper<UserDto>> Insert(UserDto user, IFormCollection data, IHostingEnvironment environment);
        Task<ResponseWrapper<UserDto>> ChangePassword(ChangePassDto changePassDto);
        Task<ResponseWrapper<UserDto>> Update(UserDto user);
        Task<ResponseWrapper<UserDto>> FindByUsernameAsync(string username, string password);
    }
}
 