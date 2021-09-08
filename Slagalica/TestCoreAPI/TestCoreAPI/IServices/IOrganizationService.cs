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
        Task<ResponseWrapper<DailyGamesResponseDto>> GetDailyGames(GetDailyGamesDto dailyGames);
        Task<ResponseWrapper<DailyGameContentDto>> GetDailyGamePlay(DateTime dailyGameDate);
        Task<ResponseWrapper<DailyGamePlayDto>> SaveDailyGamePlay(DailyGamePlayDto dailyPlay);
        Task<ResponseWrapper<List<MultiplayerGameDto>>> GetMultiplayerGames();
        Task<ResponseWrapper<MultiplayerGameDto>> GetMultiplayerGame(MultiplayerGameDto multigame);
        Task<ResponseWrapper<List<CharDto>>> GetChars(Guid gameId);
        Task<ResponseWrapper<UpdateGameEndsAndSendNumsDto>> GetNums(Guid gameId);
        Task<ResponseWrapper<List<string>>> GetCombination(Guid gameId);
        
        Task<ResponseWrapper<bool>> PlayerFinished(GameAndUserDto request);
        Task<ResponseWrapper<bool>> NextPlayerSkocko(GameAndUserDto request);
        Task<ResponseWrapper<bool>> TryNextPlayerSkocko(GameAndUserDto request);
        
        Task<ResponseWrapper<bool>> NextGame(GameAndUserDto request);
        
        Task<ResponseWrapper<GameAndUserDto>> OpponentPoints(GameAndUserDto request);
        Task<ResponseWrapper<int>> AddPoints(GameAndUserDto request);
        Task<ResponseWrapper<MultiplayerGameDto>> UpdateGameEndsAndSendCombination(UpdateGameEndsAndSendCombinationDto multigame);
        
        Task<ResponseWrapper<MultiplayerGameDto>> UpdateGameEndsAndSendNums(UpdateGameEndsAndSendNumsDto multigame);
        Task<ResponseWrapper<MultiplayerGameDto>> UpdateGameEndsAndSendChars(UpdateGameEndsAndSendCharsDto multigame);
        Task<ResponseWrapper<MultiplayerGameDto>> CreateMultiplayerGame(MultiplayerGameDto multigame);
        Task<ResponseWrapper<int>> GetSecondsLeft(MultiplayerGameDto game);
        Task<ResponseWrapper<DailyGamesResponseDto>> AddDailyGame(DailyGameDto dailyGame);
        Task<ResponseWrapper<WordDto>> AddWord(WordDto word);
        Task<ResponseWrapper<List<WordDto>>> AddWordsUpload(List<WordDto> wordsDtos);
        Task<ResponseWrapper<ConnectionDto>> AddConn(ConnectionDto conn);
        Task<ResponseWrapper<AssociationDto>> AddAssoc(AssociationDto conn);
        Task<ResponseWrapper<List<ConnectionDto>>> AddConnsUpload(List<ConnectionDto> connsDtos);
        Task<ResponseWrapper<List<AssociationDto>>> AddAssocsUpload(List<AssociationDto> assocsDtos);
        Task<ResponseWrapper<WordDto>> CheckWordValid(WordDto word);

    }
}
