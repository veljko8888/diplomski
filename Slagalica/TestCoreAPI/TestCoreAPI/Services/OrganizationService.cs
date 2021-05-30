using AutoMapper;
using Img.ELicensing.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.ApplicationConstants;
using TestCoreAPI.Dtos;
using TestCoreAPI.IServices;
using TestCoreAPI.Models;

namespace TestCoreAPI.Services
{
    public class OrganizationService : IOrganizationService
    {
        private ApplicationDbContext _context;
        private IMapper _mapper;
        public OrganizationService(
            ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ResponseWrapper<List<WordDto>>> GetLexicons()
        {
            try
            {
                List<Lexicon> lexiconsDb = await _context.Lexicons.ToListAsync();
                List<WordDto> lexicons = _mapper.Map<List<WordDto>>(lexiconsDb);
                return ResponseWrapper<List<WordDto>>.Success(lexicons);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<WordDto>>.Error(AppConstants.GetLexiconsFailed);
            }
        }

        public async Task<ResponseWrapper<List<WordDto>>> Delete(Guid lexiconId)
        {
            try
            {
                Lexicon lexiconRemove = _context.Lexicons.FirstOrDefault(x => x.Id == lexiconId);
                if (lexiconRemove != null)
                {
                    _context.Lexicons.Remove(lexiconRemove);
                    await _context.SaveChangesAsync();

                    List<Lexicon> lexiconsDb = await _context.Lexicons.ToListAsync();
                    List<WordDto> lexicons = _mapper.Map<List<WordDto>>(lexiconsDb);
                    return ResponseWrapper<List<WordDto>>.Success(lexicons);
                }

                return ResponseWrapper<List<WordDto>>.Error(AppConstants.FailedToDeleteLexicon);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<WordDto>>.Error(AppConstants.FailedToDeleteLexicon);
            }
        }

        public async Task<ResponseWrapper<List<WordDto>>> Insert(WordDto lexiconDto)
        {
            try
            {
                Lexicon lexicon = _mapper.Map<Lexicon>(lexiconDto);
                lexicon.Id = Guid.NewGuid();
                _context.Lexicons.Add(lexicon);
                await _context.SaveChangesAsync();

                List<Lexicon> lexiconsDb = await _context.Lexicons.ToListAsync();
                List<WordDto> lexicons = _mapper.Map<List<WordDto>>(lexiconsDb);
                return ResponseWrapper<List<WordDto>>.Success(lexicons);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<WordDto>>.Error(AppConstants.FailedToAddLexicon);
            }
        }

        public async Task<ResponseWrapper<DailyGamesResponseDto>> AddDailyGame(DailyGameDto dailyGameDto)
        {
            try
            {
                if(dailyGameDto.Id != null && dailyGameDto.Id != Guid.Empty)
                {
                    var dg = _mapper.Map<DailyGame>(dailyGameDto);
                    _context.DailyGames.Update(dg);
                    await _context.SaveChangesAsync();
                }
                else
                {
                    DailyGame dg = _mapper.Map<DailyGame>(dailyGameDto);
                    dg.Id = Guid.NewGuid();
                    _context.DailyGames.Add(dg);
                    await _context.SaveChangesAsync();
                }

                var date = dailyGameDto.DailyGameDate;
                var dailyGamesObj = _context.DailyGames
                    .Include(x => x.Association)
                    .Include(x => x.Connection.Pairs)
                    .FirstOrDefault(
                    x => x.DailyGameDate.Day == date.Day &&
                    x.DailyGameDate.Month == date.Month &&
                    x.DailyGameDate.Year == date.Year);

                DailyGamesResponseDto dailyGamesDto = new DailyGamesResponseDto();
                if (dailyGamesObj != null)
                {
                    dailyGamesDto = _mapper.Map<DailyGamesResponseDto>(dailyGamesObj);
                }

                var dailyGamePlays = await _context.DailyGamePlays.Where(
                    x => x.DailyGameDate.Day == date.Day &&
                    x.DailyGameDate.Month == date.Month &&
                    x.DailyGameDate.Year == date.Year).CountAsync();

                dailyGamesDto.StillNoOnePlayed = dailyGamePlays == 0;

                return ResponseWrapper<DailyGamesResponseDto>.Success(dailyGamesDto);
            }
            catch (Exception)
            {
                return ResponseWrapper<DailyGamesResponseDto>.Error(AppConstants.FailedToAddDailyGame);
            }
        }

        public async Task<ResponseWrapper<DailyGamesResponseDto>> GetDailyGames(GetDailyGamesDto dailyGamesDateDto)
        {
            try
            {
                if (dailyGamesDateDto.DailyGameDate == null || dailyGamesDateDto.DailyGameDate < DateTime.Today)
                {
                    return ResponseWrapper<DailyGamesResponseDto>.Error(AppConstants.InvalidDate);
                }

                var date = dailyGamesDateDto.DailyGameDate;
                var dailyGamesObj = _context.DailyGames
                    .Include(x => x.Association)
                    .Include(x => x.Connection.Pairs)
                    .FirstOrDefault(
                    x => x.DailyGameDate.Day == date.Day &&
                    x.DailyGameDate.Month == date.Month &&
                    x.DailyGameDate.Year == date.Year);

                DailyGamesResponseDto dailyGamesDto = new DailyGamesResponseDto();
                if (dailyGamesObj != null)
                {
                    dailyGamesDto = _mapper.Map<DailyGamesResponseDto>(dailyGamesObj);
                }
                else
                {
                    dailyGamesDto.NoGamesSavedForDate = true;
                }

                List<Connection> connections = await _context.Connections.Include(x => x.Pairs).ToListAsync();
                List<Association> associations = await _context.Associations.ToListAsync();
                dailyGamesDto.Connections = _mapper.Map<List<ConnectionDto>>(connections);
                dailyGamesDto.Associations = _mapper.Map<List<AssociationDto>>(associations);

                var dailyGamePlays = await _context.DailyGamePlays.Where(
                    x => x.DailyGameDate.Day == date.Day &&
                    x.DailyGameDate.Month == date.Month &&
                    x.DailyGameDate.Year == date.Year).CountAsync();

                dailyGamesDto.StillNoOnePlayed = dailyGamePlays == 0;

                return ResponseWrapper<DailyGamesResponseDto>.Success(dailyGamesDto);
            }
            catch (Exception)
            {
                return ResponseWrapper<DailyGamesResponseDto>.Error(AppConstants.FailedToRetrieveDailyGames);
            }
        }

        public async Task<ResponseWrapper<WordDto>> CheckWordValid(WordDto wordDto)
        {
            try
            {
                var alreadyExist = _context.Words.Any(x => x.Rec.Equals(wordDto.Rec));
                if (alreadyExist)
                {
                    return ResponseWrapper<WordDto>.Success(wordDto);
                }

                return ResponseWrapper<WordDto>.Error(AppConstants.WordDoesNotExist);
            }
            catch (Exception)
            {
                return ResponseWrapper<WordDto>.Error(AppConstants.FailedValidWordCheck);
            }
        }

        public async Task<ResponseWrapper<WordDto>> AddWord(WordDto wordDto)
        {
            try
            {
                var alreadyExist = _context.Words.Any(x => x.Rec.Equals(wordDto.Rec));
                if (alreadyExist)
                {
                    return ResponseWrapper<WordDto>.Error(AppConstants.FailedToAddWordExist);
                }

                Word word = _mapper.Map<Word>(wordDto);
                word.Rec = word.Rec.ToUpper();
                word.Id = Guid.NewGuid();
                _context.Words.Add(word);
                await _context.SaveChangesAsync();
                wordDto = _mapper.Map<WordDto>(word);

                return ResponseWrapper<WordDto>.Success(wordDto);
            }
            catch (Exception)
            {
                return ResponseWrapper<WordDto>.Error(AppConstants.FailedToAddWord);
            }
        }

        public async Task<ResponseWrapper<List<WordDto>>> AddWordsUpload(List<WordDto> wordsDtos)
        {
            try
            {
                List<Word> words = _mapper.Map<List<Word>>(wordsDtos);
                words = words.Select(c => { 
                    c.Id = Guid.NewGuid();
                    c.Rec = c.Rec.ToUpper();
                    return c; 
                }).ToList();
                _context.Words.AddRange(words);
                await _context.SaveChangesAsync();
                wordsDtos = _mapper.Map<List<WordDto>>(words);

                return ResponseWrapper<List<WordDto>>.Success(wordsDtos);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<WordDto>>.Error(AppConstants.FailedToAddWord);
            }
        }

        public async Task<ResponseWrapper<ConnectionDto>> AddConn(ConnectionDto connDto)
        {
            try
            {
                Connection conn = _mapper.Map<Connection>(connDto);
                conn.Id = Guid.NewGuid();
                _context.Connections.Add(conn);
                await _context.SaveChangesAsync();
                connDto = _mapper.Map<ConnectionDto>(conn);

                return ResponseWrapper<ConnectionDto>.Success(connDto);
            }
            catch (Exception)
            {
                return ResponseWrapper<ConnectionDto>.Error(AppConstants.FailedToAddConnGame);
            }
        }

        public async Task<ResponseWrapper<List<ConnectionDto>>> AddConnsUpload(List<ConnectionDto> connsDtos)
        {
            try
            {
                List<Connection> conns = _mapper.Map<List<Connection>>(connsDtos);
                conns = conns.Select(c => { c.Id = Guid.NewGuid(); return c; }).ToList();
                _context.Connections.AddRange(conns);
                await _context.SaveChangesAsync();
                connsDtos = _mapper.Map<List<ConnectionDto>>(conns);

                return ResponseWrapper<List<ConnectionDto>>.Success(connsDtos);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<ConnectionDto>>.Error(AppConstants.FailedToAddConnGame);
            }
        }

        public async Task<ResponseWrapper<AssociationDto>> AddAssoc(AssociationDto assocDto)
        {
            try
            {
                var finalSinonymsList = assocDto.Final.Split(',').Where(s => !string.IsNullOrWhiteSpace(s)).Select(c => { c = c.Trim(); return c; }).ToList();
                var finalCommaSeparatedSinonyms = string.Join(",", finalSinonymsList);
                assocDto.Final = finalCommaSeparatedSinonyms;

                var ASinonymsList = assocDto.A.Split(',').Where(s => !string.IsNullOrWhiteSpace(s)).Select(c => { c = c.Trim(); return c; }).ToList();
                var ACommaSeparatedSinonyms = string.Join(",", ASinonymsList);
                assocDto.A = ACommaSeparatedSinonyms;

                var BSinonymsList = assocDto.B.Split(',').Where(s => !string.IsNullOrWhiteSpace(s)).Select(c => { c = c.Trim(); return c; }).ToList();
                var BCommaSeparatedSinonyms = string.Join(",", BSinonymsList);
                assocDto.B = BCommaSeparatedSinonyms;

                var CSinonymsList = assocDto.C.Split(',').Where(s => !string.IsNullOrWhiteSpace(s)).Select(c => { c = c.Trim(); return c; }).ToList();
                var CCommaSeparatedSinonyms = string.Join(",", CSinonymsList);
                assocDto.C = CCommaSeparatedSinonyms;

                var DSinonymsList = assocDto.D.Split(',').Where(s => !string.IsNullOrWhiteSpace(s)).Select(c => { c = c.Trim(); return c; }).ToList();
                var DCommaSeparatedSinonyms = string.Join(",", DSinonymsList);
                assocDto.D = DCommaSeparatedSinonyms;

                Association assoc = _mapper.Map<Association>(assocDto);
                assoc.Id = Guid.NewGuid();
                _context.Associations.Add(assoc);
                await _context.SaveChangesAsync();
                assocDto = _mapper.Map<AssociationDto>(assoc);

                return ResponseWrapper<AssociationDto>.Success(assocDto);
            }
            catch (Exception)
            {
                return ResponseWrapper<AssociationDto>.Error(AppConstants.FailedToAddAssocGame);
            }
        }

        public async Task<ResponseWrapper<List<AssociationDto>>> AddAssocsUpload(List<AssociationDto> assocsDtos)
        {
            try
            {
                List<Association> assocs = _mapper.Map<List<Association>>(assocsDtos);
                assocs = assocs.Select(c => { c.Id = Guid.NewGuid(); return c; }).ToList();
                _context.Associations.AddRange(assocs);
                await _context.SaveChangesAsync();
                assocsDtos = _mapper.Map<List<AssociationDto>>(assocs);

                return ResponseWrapper<List<AssociationDto>>.Success(assocsDtos);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<AssociationDto>>.Error(AppConstants.FailedToAddAssocGame);
            }
        }


        public async Task<ResponseWrapper<List<WordDto>>> Update(WordDto lexiconDto)
        {
            try
            {
                Lexicon lexiconUpdate = _context.Lexicons.AsNoTracking().FirstOrDefault(x => x.Id == lexiconDto.Id);
                if (lexiconUpdate != null)
                {
                    lexiconUpdate = _mapper.Map<Lexicon>(lexiconDto);
                    _context.Lexicons.Update(lexiconUpdate);
                    await _context.SaveChangesAsync();

                    List<Lexicon> lexiconsDb = await _context.Lexicons.ToListAsync();
                    List<WordDto> lexicons = _mapper.Map<List<WordDto>>(lexiconsDb);
                    return ResponseWrapper<List<WordDto>>.Success(lexicons);
                }

                return ResponseWrapper<List<WordDto>>.Error(AppConstants.FailedToUpdateLexicon);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<WordDto>>.Error(AppConstants.FailedToUpdateLexicon);
            }
        }

        public async Task<ResponseWrapper<List<UserDto>>> GetUsers()
        {
            try
            {
                List<User> usersDb = await _context.Users.ToListAsync();
                List<UserDto> users = _mapper.Map<List<UserDto>>(usersDb);
                return ResponseWrapper<List<UserDto>>.Success(users);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<UserDto>>.Error(AppConstants.GetUsersFailed);
            }
        }

        public async Task<ResponseWrapper<List<UserDto>>> ActivateDeactivateUser(UserDto user)
        {
            try
            {
                var userDB = _context.Users.FirstOrDefault(x => x.Id == user.Id);
                userDB.NalogAktiviran = !userDB.NalogAktiviran;
                _context.Users.Update(userDB);
                await _context.SaveChangesAsync();
                List<User> usersDb = await _context.Users.ToListAsync();
                List<UserDto> users = _mapper.Map<List<UserDto>>(usersDb);
                return ResponseWrapper<List<UserDto>>.Success(users);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<UserDto>>.Error(AppConstants.GetUsersFailed);
            }
        }
    }
}
