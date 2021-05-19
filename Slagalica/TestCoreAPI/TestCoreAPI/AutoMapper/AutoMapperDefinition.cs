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
            CreateMap<Lexicon, WordDto>().ReverseMap();
            CreateMap<Word, WordDto>().ReverseMap();
            CreateMap<Connection, ConnectionDto>().ReverseMap();
            CreateMap<Pair, PairDto>().ReverseMap();
            CreateMap<Association, AssociationDto>().ReverseMap();
        }
    }
}
