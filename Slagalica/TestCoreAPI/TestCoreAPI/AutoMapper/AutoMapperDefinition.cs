using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.Dtos;
using TestCoreAPI.Models;

namespace TestCoreAPI.AutoMapper
{
    public class AutoMapperDefinition : Profile
    {
        public AutoMapperDefinition()
        {
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<Lexicon, LexiconDto>().ReverseMap();
        }
    }
}
