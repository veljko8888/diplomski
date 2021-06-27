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
            CreateMap<DailyGame, DailyGamesResponseDto>().ReverseMap();
            CreateMap<DailyGame, DailyGameDto>().ReverseMap();
            CreateMap<DailyGamePlay, DailyGamePlayDto>().ReverseMap();
            CreateMap<MultiplayerGame, MultiplayerGameDto>().ReverseMap();
        }
    }
}
