using Img.ELicensing.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.Models;

namespace TestCoreAPI.IServices
{
    public interface IUserService
    {
        Task<ResponseWrapper<List<UserDto>>> GetAll();
        Task<ResponseWrapper<UserDto>> GetById(Guid id);
        Task<ResponseWrapper<UserDto>> Insert(UserDto user);
        Task<ResponseWrapper<UserDto>> Update(UserDto user);
        Task<ResponseWrapper<UserDto>> FindByUsernameAsync(string username, string password);
        Task<ResponseWrapper<bool>> CheckTokenForUser(string userId, string token);
        
        //void Delete(User user); 
    }
}
 