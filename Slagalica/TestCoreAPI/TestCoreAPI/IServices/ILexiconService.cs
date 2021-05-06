using Img.ELicensing.Core;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.Dtos;

namespace TestCoreAPI.IServices
{
    public interface ILexiconService
    {
        Task<ResponseWrapper<List<LexiconDto>>> GetLexicons();
        Task<ResponseWrapper<List<LexiconDto>>> Delete(Guid id);
        Task<ResponseWrapper<List<LexiconDto>>> Insert(LexiconDto user);
        Task<ResponseWrapper<List<LexiconDto>>> Update(LexiconDto user);
    }
}
