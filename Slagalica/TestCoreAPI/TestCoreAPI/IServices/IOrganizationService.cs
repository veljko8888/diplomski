using Img.ELicensing.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.Dtos;
using TestCoreAPI.Models;

namespace TestCoreAPI.IServices
{
    public interface IOrganizationService
    {
        Task<ResponseWrapper<List<WordDto>>> GetLexicons();
        Task<ResponseWrapper<List<WordDto>>> Delete(Guid id);
        Task<ResponseWrapper<List<WordDto>>> Insert(WordDto word);
        Task<ResponseWrapper<List<WordDto>>> Update(WordDto word);
        Task<ResponseWrapper<List<UserDto>>> ActivateDeactivateUser(UserDto user);
        Task<ResponseWrapper<List<UserDto>>> GetUsers();
        Task<ResponseWrapper<WordDto>> AddWord(WordDto word);
        Task<ResponseWrapper<ConnectionDto>> AddConn(ConnectionDto conn);
        Task<ResponseWrapper<AssociationDto>> AddAssoc(AssociationDto conn);

    }
}
