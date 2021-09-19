using AutoMapper;
using Img.ELicensing.Core;
using Microsoft.AspNetCore.SignalR;
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
using TestCoreAPI.SignalRHub;

namespace TestCoreAPI.Services
{
    public class OrganizationService : IOrganizationService
    {
        private ApplicationDbContext _context;
        private IMapper _mapper;
        private readonly IHubContext<BroadcastHub, IHubClient> _hubContext;
        public OrganizationService(
            IHubContext<BroadcastHub, IHubClient> hubContext,
            ApplicationDbContext context,
            IMapper mapper)
        {
            _hubContext = hubContext;
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
                if (dailyGameDto.Id != null && dailyGameDto.Id != Guid.Empty)
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

        public async Task<ResponseWrapper<DailyGamePlayDto>> SaveDailyGamePlay(DailyGamePlayDto dailyGame)
        {
            try
            {
                var gamePlay = _mapper.Map<DailyGamePlay>(dailyGame);
                await _context.DailyGamePlays.AddAsync(gamePlay);
                await _context.SaveChangesAsync();
                dailyGame = _mapper.Map<DailyGamePlayDto>(gamePlay);

                return ResponseWrapper<DailyGamePlayDto>.Success(dailyGame);
            }
            catch (Exception)
            {
                return ResponseWrapper<DailyGamePlayDto>.Error(AppConstants.NoDailyGame);
            }
        }

        public async Task<ResponseWrapper<List<MultiplayerGameDto>>> GetMultiplayerGames()
        {
            try
            {
                var games = await _context.MultiplayerGames.Include(x => x.Player1).Include(x => x.Player2).Include(x => x.Winner).Where(x => x.GameStatus == 0).ToListAsync();
                var gamesDto = _mapper.Map<List<MultiplayerGameDto>>(games);

                return ResponseWrapper<List<MultiplayerGameDto>>.Success(gamesDto);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<MultiplayerGameDto>>.Error(AppConstants.NoDailyGame);
            }
        }

        public async Task<ResponseWrapper<int>> GetSecondsLeft(MultiplayerGameDto game)
        {
            try
            {
                var gameDb = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == game.Id);
                int diffInSeconds = (int)(gameDb.SlagalicaGameEnds - DateTime.UtcNow).TotalSeconds;

                return ResponseWrapper<int>.Success(diffInSeconds);
            }
            catch (Exception)
            {
                return ResponseWrapper<int>.Error(AppConstants.NoDailyGame);
            }
        }

        public async Task<ResponseWrapper<List<string>>> GetCombination(Guid gameId)
        {
            var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == gameId);
            if (game != null)
            {
                List<string> combination = game.Combination.Split('-').ToList();
                return ResponseWrapper<List<string>>.Success(combination);
            }

            return ResponseWrapper<List<string>>.Error("Problem with getting combination.");
        }

        public async Task<ResponseWrapper<UpdateGameEndsAndSendNumsDto>> GetNums(Guid gameId)
        {
            var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == gameId);
            if (game != null)
            {
                var res = new UpdateGameEndsAndSendNumsDto();
                string[] nums = game.Nums.Split('#');
                var numsArray = new List<NumDto>();
                foreach (var numChar in nums.Select((value, i) => new { i, value }))
                {
                    if (numChar.i == 12)
                    {
                        res.FinalNum = int.Parse(numChar.value.ToString());
                    }
                    else
                    {
                        var numElem = new NumDto();
                        numElem.Clicked = false;
                        numElem.Value = numChar.value.ToString();
                        numsArray.Add(numElem);
                    }
                }

                res.Nums = numsArray;

                return ResponseWrapper<UpdateGameEndsAndSendNumsDto>.Success(res);
            }

            return ResponseWrapper<UpdateGameEndsAndSendNumsDto>.Error("Problem with getting chars.");
        }

        public async Task<ResponseWrapper<List<CharDto>>> GetChars(Guid gameId)
        {
            var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == gameId);
            if (game != null)
            {
                string chars = game.Chars;
                var charsArray = new List<CharDto>();
                foreach (char character in chars)
                {
                    var charElem = new CharDto();
                    charElem.Clicked = false;
                    charElem.Value = character.ToString();
                    charsArray.Add(charElem);
                }

                return ResponseWrapper<List<CharDto>>.Success(charsArray);
            }

            return ResponseWrapper<List<CharDto>>.Error("Problem with getting chars.");
        }

        public async Task<ResponseWrapper<int>> AddPoints(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    if (game.Player1Id == request.UserId)
                    {
                        game.Player1Points += request.AddPoints;
                    }
                    else
                    {
                        game.Player2Points += request.AddPoints;
                    }
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    return ResponseWrapper<int>.Success(0);
                }
                catch (Exception)
                {
                    return ResponseWrapper<int>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<int>> OpponentCalcNum(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var opponentCalcNum = 0;
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    if (game.Player1Id == request.UserId)
                    {
                        opponentCalcNum = game.Player2EvalResult;
                    }
                    else
                    {
                        opponentCalcNum = game.Player1EvalResult;
                    }
                    transaction.Commit();
                    return ResponseWrapper<int>.Success(opponentCalcNum);
                }
                catch (Exception)
                {
                    return ResponseWrapper<int>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<GameAndUserDto>> OpponentPoints(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var opponentPoints = 0;
                    var points = 0;
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    if (game.Player1Id == request.UserId)
                    {
                        opponentPoints = game.Player2Points;
                        points = game.Player1Points;
                    }
                    else
                    {
                        opponentPoints = game.Player1Points;
                        points = game.Player2Points;
                    }
                    transaction.Commit();
                    var res = new GameAndUserDto();
                    res.OpponentPoints = opponentPoints;
                    res.Points = points;
                    return ResponseWrapper<GameAndUserDto>.Success(res);
                }
                catch (Exception)
                {
                    return ResponseWrapper<GameAndUserDto>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<bool>> NextGame(GameAndUserDto request)
        {
            try
            {
                await _hubContext.Clients.Group(request.GameId.ToString()).NextGame();
                return ResponseWrapper<bool>.Success(true);
            }
            catch (Exception)
            {
                return ResponseWrapper<bool>.Error("");
            }
        }

        public async Task<ResponseWrapper<int>> OnMoveAssoc(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    transaction.Commit();
                    return ResponseWrapper<int>.Success(game.OnMove);
                }
                catch (Exception)
                {
                    return ResponseWrapper<int>.Error("");
                }
            }
        }

        public async Task<ResponseWrapper<GameAndUserDto>> GetOpenedField(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    var res = new GameAndUserDto();
                    res.Value = game.Value;
                    res.FieldName = game.FieldName;
                    transaction.Commit();
                    return ResponseWrapper<GameAndUserDto>.Success(res);
                }
                catch (Exception)
                {
                    return ResponseWrapper<GameAndUserDto>.Error("");
                }
            }
        }

        public async Task<ResponseWrapper<bool>> OpenFieldNotif(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    game.FieldName = request.FieldName;
                    game.Value = request.Value;
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    await _hubContext.Clients.Group(request.GameId.ToString()).FieldOpened();
                    return ResponseWrapper<bool>.Success(true);
                }
                catch (Exception)
                {
                    return ResponseWrapper<bool>.Error("");
                }
            }
        }

        public async Task<ResponseWrapper<bool>> AssocTimesUp(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    transaction.Commit();
                    await _hubContext.Clients.Group(request.GameId.ToString()).TimesUpAssoc();
                    return ResponseWrapper<bool>.Success(true);
                }
                catch (Exception)
                {
                    return ResponseWrapper<bool>.Error("");
                }
            }
        }

        public async Task<ResponseWrapper<GameAndUserDto>> GetForOpponentAssoc(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    var res = new GameAndUserDto();
                    res.PlayerIdWhoSolved = game.PlayerIdWhoSolved;
                    res.SolvedCols = game.SolvedForOpponent.Split('-').ToList();
                    transaction.Commit();
                    
                    return ResponseWrapper<GameAndUserDto>.Success(res);
                }
                catch (Exception)
                {
                    return ResponseWrapper<GameAndUserDto>.Error("");
                }
            }
        }

        public async Task<ResponseWrapper<bool>> AssocNotifyOpponentAndSendSolved(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    game.PlayerIdWhoSolved = request.UserId;
                    game.SolvedForOpponent = string.Join("-", request.SolvedCols);
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    await _hubContext.Clients.Group(request.GameId.ToString()).NotifyOpponentForAssocSol();
                    return ResponseWrapper<bool>.Success(true);
                }
                catch (Exception)
                {
                    return ResponseWrapper<bool>.Error("");
                }
            }
        }

        public async Task<ResponseWrapper<bool>> NextPlayerAssoc(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    if(request.UserId == game.Player1Id)
                    {
                        game.OnMove = 2;
                    }
                    else
                    {
                        game.OnMove = 1;
                    }
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    await _hubContext.Clients.Group(request.GameId.ToString()).NextPlayerAssoc();
                    return ResponseWrapper<bool>.Success(true);
                }
                catch (Exception)
                {
                    return ResponseWrapper<bool>.Error("");
                }
            }
        }

        public async Task<ResponseWrapper<bool>> NextPlayerSkocko(GameAndUserDto request)
        {
            try
            {
                await _hubContext.Clients.Group(request.GameId.ToString()).NextPlayerSkocko();
                return ResponseWrapper<bool>.Success(true);
            }
            catch (Exception)
            {
                return ResponseWrapper<bool>.Error("");
            }
        }

        public async Task<ResponseWrapper<bool>> TryNextPlayerSkocko(GameAndUserDto request)
        {
            try
            {
                var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                if (request.UserId == game.Player1Id)
                {
                    await _hubContext.Clients.Group(request.GameId.ToString()).TryNextPlayerSkocko();
                }
                else
                {
                    await _hubContext.Clients.Group(request.GameId.ToString()).TryNextPlayerSkockoPlayer2();
                }
                //await _hubContext.Clients.Group(request.GameId.ToString()).NextPlayerSkocko();
                return ResponseWrapper<bool>.Success(true);
            }
            catch (Exception)
            {
                return ResponseWrapper<bool>.Error("");
            }
        }

        public async Task<ResponseWrapper<bool>> PlayerFinished(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var call = 0;
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    MultiplayerGame game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    if (game.Player1Id == request.UserId)
                    {
                        game.Player1WordsFinished = true;
                        game.Player1EvalResult = request.EvalResult;
                    }
                    else
                    {
                        game.Player2WordsFinished = true;
                        game.Player2EvalResult = request.EvalResult;
                    }

                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();

                    if (game.Player1WordsFinished && game.Player2WordsFinished)
                    {
                        if (request.GameName == "slagalica")
                        {
                            call = 1;
                        }
                        else if (request.GameName == "mojbroj")
                        {
                            call = 2;
                        }

                        game.Player1WordsFinished = false;
                        game.Player2WordsFinished = false;
                        _context.MultiplayerGames.Update(game);
                        await _context.SaveChangesAsync();
                    }
                    transaction.Commit();
                    if(call == 1)
                    {
                        await _hubContext.Clients.Group(game.Id.ToString()).WordsFinished();
                    }
                    else if(call == 2)
                    {
                        await _hubContext.Clients.Group(game.Id.ToString()).NumsFinished();
                    }
                    return ResponseWrapper<bool>.Success(true);
                }
                catch (Exception)
                {
                    return ResponseWrapper<bool>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<bool>> UpdateGameEndsAndNotifyAssoc(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);
                    game.SlagalicaGameEnds = DateTime.UtcNow.AddSeconds(240);
                    if (request.ShouldUpdateSpojniceGamePoints)
                    {
                        game.Player1SpojnicePoints = game.Player1Points - game.Player1SlagalicaPoints - game.Player1MojBrojPoints - game.Player1SkockoPoints;
                        game.Player2SpojnicePoints = game.Player2Points - game.Player2SlagalicaPoints - game.Player2MojBrojPoints - game.Player2SkockoPoints;
                    }
                    
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    await _hubContext.Clients.Group(game.Id.ToString()).CountdownTimerAssoc();
                    return ResponseWrapper<bool>.Success(true);
                }
                catch (Exception)
                {
                    return ResponseWrapper<bool>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<MultiplayerGameDto>> UpdateGameEndsAndNotifyCombinations(UpdateGameEndsAndNotifyCombinationsDto multigame)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == multigame.MultiplayerGameDto.Id);
                    game.SlagalicaGameEnds = DateTime.UtcNow.AddSeconds(60);
                    game.Player1SkockoPoints = game.Player1Points - game.Player1SlagalicaPoints - game.Player1MojBrojPoints;
                    game.Player2SkockoPoints = game.Player2Points - game.Player2SlagalicaPoints - game.Player2MojBrojPoints;
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    multigame.MultiplayerGameDto = _mapper.Map<MultiplayerGameDto>(game);
                    transaction.Commit();
                    await _hubContext.Clients.Group(game.Id.ToString()).CountdownTimerSpojnice();
                    return ResponseWrapper<MultiplayerGameDto>.Success(multigame.MultiplayerGameDto);
                }
                catch (Exception)
                {
                    return ResponseWrapper<MultiplayerGameDto>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<MultiplayerGameDto>> UpdateGameEndsAndSendCombination(UpdateGameEndsAndSendCombinationDto multigame)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    string comb = string.Join("-", multigame.Combination);
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == multigame.MultiplayerGameDto.Id);
                    game.SlagalicaGameEnds = DateTime.UtcNow.AddSeconds(60);
                    game.Combination = comb;
                    game.Player1MojBrojPoints = game.Player1Points - game.Player1SlagalicaPoints;
                    game.Player2MojBrojPoints = game.Player2Points - game.Player2SlagalicaPoints;
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                    multigame.MultiplayerGameDto = _mapper.Map<MultiplayerGameDto>(game);
                    if (multigame.UserId == game.Player1Id)
                    {
                        await _hubContext.Clients.Group(game.Id.ToString()).CountdownTimerSkocko();
                    }
                    else
                    {
                        await _hubContext.Clients.Group(game.Id.ToString()).CountdownTimerSkockoPlayer2();
                    }
                    return ResponseWrapper<MultiplayerGameDto>.Success(multigame.MultiplayerGameDto);
                }
                catch (Exception)
                {
                    return ResponseWrapper<MultiplayerGameDto>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<MultiplayerGameDto>> UpdateGameEndsAndSendNums(UpdateGameEndsAndSendNumsDto multigame)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    string nums = string.Empty;
                    foreach (var num in multigame.Nums)
                    {
                        nums += num.Value.ToString();
                        nums += "#";
                    }
                    nums += multigame.FinalNum;

                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == multigame.MultiplayerGameDto.Id);
                    game.SlagalicaGameEnds = DateTime.UtcNow.AddSeconds(60);
                    game.Nums = nums;
                    //NOT SURE ABOUT THIS DOWN 
                    game.Player1SlagalicaPoints = game.Player1Points;
                    game.Player2SlagalicaPoints = game.Player2Points;
                    _context.MultiplayerGames.Update(game);
                    await _context.SaveChangesAsync();
                    multigame.MultiplayerGameDto = _mapper.Map<MultiplayerGameDto>(game);
                    transaction.Commit();
                    await _hubContext.Clients.Group(game.Id.ToString()).CountdownTimerNums();
                    return ResponseWrapper<MultiplayerGameDto>.Success(multigame.MultiplayerGameDto);
                }
                catch (Exception)
                {
                    return ResponseWrapper<MultiplayerGameDto>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<GameAndUserDto>> AllPoints(GameAndUserDto request)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == request.GameId);

                    var response = new GameAndUserDto();
                    response.Player1SlagalicaPoints = game.Player1SlagalicaPoints;
                    response.Player1MojBrojPoints = game.Player1MojBrojPoints;
                    response.Player1SkockoPoints = game.Player1SkockoPoints;
                    response.Player1SpojnicePoints = game.Player1SpojnicePoints;
                    response.Player1AsocijacijePoints = game.Player1Points - game.Player1SlagalicaPoints - game.Player1MojBrojPoints - game.Player1SkockoPoints - game.Player1SpojnicePoints;
                    response.Player2SlagalicaPoints = game.Player2SlagalicaPoints;
                    response.Player2MojBrojPoints = game.Player2MojBrojPoints;
                    response.Player2SkockoPoints = game.Player2SkockoPoints;
                    response.Player2SpojnicePoints = game.Player2SpojnicePoints;
                    response.Player2AsocijacijePoints = game.Player2Points - game.Player2SlagalicaPoints - game.Player2MojBrojPoints - game.Player2SkockoPoints - game.Player2SpojnicePoints;
                    transaction.Commit();
                    return ResponseWrapper<GameAndUserDto>.Success(response);
                }
                catch (Exception)
                {
                    return ResponseWrapper<GameAndUserDto>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<BestUsersDto>> GetStatsForUser(GameAndUserDto request)
        {
            try
            {
                User user = await _context.Users.FirstOrDefaultAsync(x => x.Id == request.UserId);
                List<BestUserDto> rank10days = await _context.DailyGamePlays
                     .Where(x => x.DailyGameDate >= DateTime.Today.AddDays(-10) && x.DailyGameDate <= DateTime.Today)
                     .Select(x => new
                     {
                         x.User.KorisnickoIme,
                         x.Points,
                     })
                    .GroupBy(p => p.KorisnickoIme, x => x.Points)
                    .Select(g => new BestUserDto
                    {
                        UserName = g.Key,
                        AveragePointsPerGame = g.Sum() / 10,
                        TotalPoints = g.Sum()
                    }).OrderByDescending(x => x.AveragePointsPerGame).Take(10).ToListAsync();

                List<BestUserDto> rank10daysAll = await _context.DailyGamePlays
                     .Where(x => x.DailyGameDate >= DateTime.Today.AddDays(-10) && x.DailyGameDate <= DateTime.Today)
                     .Select(x => new
                     {
                         x.User.KorisnickoIme,
                         x.Points,
                     })
                    .GroupBy(p => p.KorisnickoIme, x => x.Points)
                    .Select(g => new BestUserDto
                    {
                        UserName = g.Key,
                        AveragePointsPerGame = g.Sum() / 10,
                        TotalPoints = g.Sum()
                    }).OrderByDescending(x => x.AveragePointsPerGame).ToListAsync();
                (BestUserDto user, int index) userRank = rank10daysAll.Select((user, index) => (user, index)).FirstOrDefault(x => x.user.UserName == user.KorisnickoIme);

                List<BestUserDto> playsVsOthers = await _context.MultiplayerGames
                     .Where(x => (x.Player1Id == request.UserId || x.Player2Id == request.UserId) && x.MultiplayerGameDate >= DateTime.Today.AddDays(-10) && x.MultiplayerGameDate <= DateTime.Today)
                     .Select(g => new BestUserDto
                     {
                         UserName = g.Player1.KorisnickoIme,
                         TotalPoints = g.Player1Points,
                         UserName2 = g.Player2.KorisnickoIme,
                         TotalPoints2 = g.Player2Points
                     }).ToListAsync();


                var bestUsersRankings = new BestUsersDto();
                bestUsersRankings.Rank7Days = new List<BestUserDto>();
                bestUsersRankings.PlaysVsOthers = new List<BestUserDto>();
                if (rank10days != null && playsVsOthers != null)
                {
                    bestUsersRankings.Rank10Days = rank10days;
                    bestUsersRankings.PlaysVsOthers = playsVsOthers;
                    bestUsersRankings.CurrentUserRank = userRank.user;
                    bestUsersRankings.CurrentUserRank.Ranking = userRank.index + 1;
                    bestUsersRankings.ShouldDisplayMyRankSeparate = bestUsersRankings.CurrentUserRank.Ranking > 10;
                }

                return ResponseWrapper<BestUsersDto>.Success(bestUsersRankings);
            }
            catch (Exception)
            {
                return ResponseWrapper<BestUsersDto>.Error(AppConstants.RanksError);
            }
        }

        public async Task<ResponseWrapper<MultiplayerGameDto>> UpdateGameEndsAndSendChars(UpdateGameEndsAndSendCharsDto multiGame)
        {
            try
            {
                string chars = string.Empty;
                foreach (var character in multiGame.Chars)
                {
                    chars += character.Value;
                }

                var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == multiGame.MultiplayerGameDto.Id);
                game.SlagalicaGameEnds = DateTime.UtcNow.AddSeconds(60);
                game.Chars = chars;
                _context.MultiplayerGames.Update(game);
                await _context.SaveChangesAsync();
                multiGame.MultiplayerGameDto = _mapper.Map<MultiplayerGameDto>(game);
                await _hubContext.Clients.Group(game.Id.ToString()).CountdownTimer();
                return ResponseWrapper<MultiplayerGameDto>.Success(multiGame.MultiplayerGameDto);
            }
            catch (Exception)
            {
                return ResponseWrapper<MultiplayerGameDto>.Error(AppConstants.NoDailyGame);
            }
        }

        public async Task<ResponseWrapper<MultiplayerGameDto>> GetMultiplayerGame(MultiplayerGameDto multiGame)
        {
            try
            {
                var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == multiGame.Id);
                game.Player2Id = multiGame.Player2Id;
                _context.MultiplayerGames.Update(game);
                await _context.SaveChangesAsync();
                multiGame = _mapper.Map<MultiplayerGameDto>(game);
                return ResponseWrapper<MultiplayerGameDto>.Success(multiGame);
            }
            catch (Exception)
            {
                return ResponseWrapper<MultiplayerGameDto>.Error(AppConstants.NoDailyGame);
            }
        }

        public async Task<ResponseWrapper<MultiplayerGameDto>> CreateMultiplayerGame(MultiplayerGameDto multiGame)
        {
            try
            {
                //_hubContext.
                var gamePlay = _mapper.Map<MultiplayerGame>(multiGame);
                gamePlay.Id = Guid.NewGuid();

                await _context.MultiplayerGames.AddAsync(gamePlay);
                await _context.SaveChangesAsync();
                await _hubContext.Groups.AddToGroupAsync(gamePlay.Id.ToString(), gamePlay.Id.ToString());
                multiGame = _mapper.Map<MultiplayerGameDto>(gamePlay);

                await _hubContext.Clients.All.BroadcastMessage();
                return ResponseWrapper<MultiplayerGameDto>.Success(multiGame);
            }
            catch (Exception)
            {
                return ResponseWrapper<MultiplayerGameDto>.Error(AppConstants.NoDailyGame);
            }
        }

        public async Task<ResponseWrapper<DailyGameContentDto>> GetAssoc(DateTime gamesDate)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM DailyGames WITH (TABLOCKX, HOLDLOCK)");
                    var dailyGame = await _context.DailyGames.Include(x => x.Association).Include(x => x.Connection.Pairs).FirstOrDefaultAsync(x => x.DailyGameDate.Day == gamesDate.Day && x.DailyGameDate.Month == gamesDate.Month && x.DailyGameDate.Year == gamesDate.Year);
                    if (dailyGame == null)
                    {
                        return ResponseWrapper<DailyGameContentDto>.Error(AppConstants.NoDailyGame);
                    }

                    var association = _mapper.Map<AssociationDto>(dailyGame.Association);
                    var connection = _mapper.Map<ConnectionDto>(dailyGame.Connection);
                    DailyGameContentDto response = new DailyGameContentDto();
                    response.Connections = connection;
                    response.Associations = association;
                    response.GameState = 4;
                    transaction.Commit();
                    return ResponseWrapper<DailyGameContentDto>.Success(response);
                }
                catch (Exception)
                {
                    return ResponseWrapper<DailyGameContentDto>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<DailyGameContentDto>> GetSpojnice(DateTime gamesDate)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM DailyGames WITH (TABLOCKX, HOLDLOCK)");
                    var dailyGame = await _context.DailyGames.Include(x => x.Association).Include(x => x.Connection.Pairs).FirstOrDefaultAsync(x => x.DailyGameDate.Day == gamesDate.Day && x.DailyGameDate.Month == gamesDate.Month && x.DailyGameDate.Year == gamesDate.Year);
                    if (dailyGame == null)
                    {
                        return ResponseWrapper<DailyGameContentDto>.Error(AppConstants.NoDailyGame);
                    }

                    var association = _mapper.Map<AssociationDto>(dailyGame.Association);
                    var connection = _mapper.Map<ConnectionDto>(dailyGame.Connection);
                    DailyGameContentDto response = new DailyGameContentDto();
                    response.Connections = connection;
                    response.Associations = association;
                    response.GameState = 1;
                    transaction.Commit();
                    return ResponseWrapper<DailyGameContentDto>.Success(response);
                }
                catch (Exception)
                {
                    return ResponseWrapper<DailyGameContentDto>.Error(AppConstants.NoDailyGame);
                }
            }
        }

        public async Task<ResponseWrapper<DailyGameContentDto>> GetDailyGamePlay(DateTime dailyGamesDateDto)
        {
            try
            {
                var dailyGame = _context.DailyGames.Include(x => x.Association).Include(x => x.Connection.Pairs).FirstOrDefault(x => x.DailyGameDate.Day == dailyGamesDateDto.Day && x.DailyGameDate.Month == dailyGamesDateDto.Month && x.DailyGameDate.Year == dailyGamesDateDto.Year);
                if (dailyGame == null)
                {
                    return ResponseWrapper<DailyGameContentDto>.Error(AppConstants.NoDailyGame);
                }

                var association = _mapper.Map<AssociationDto>(dailyGame.Association);
                var connection = _mapper.Map<ConnectionDto>(dailyGame.Connection);
                DailyGameContentDto response = new DailyGameContentDto();
                response.Connections = connection;
                response.Associations = association;
                return ResponseWrapper<DailyGameContentDto>.Success(response);
            }
            catch (Exception)
            {
                return ResponseWrapper<DailyGameContentDto>.Error(AppConstants.NoDailyGame);
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
                bool alreadyExist = false;
                MultiplayerGame game = null;
                using (var transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                        alreadyExist = _context.Words.Any(x => x.Rec.Equals(wordDto.Rec));
                        
                        if (alreadyExist)
                        {
                            if (wordDto.GameId.HasValue)
                            {
                                game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == wordDto.GameId.Value);
                                if (wordDto.GameId.HasValue && wordDto.UserId.HasValue)
                                {
                                    if (game != null)
                                    {
                                        if (game.Player1Id == wordDto.UserId)
                                        {
                                            game.Player1Points += wordDto.Rec.Length * 2;
                                            game.Player1WordsFinished = false;
                                        }
                                        else
                                        {
                                            game.Player2Points += wordDto.Rec.Length * 2;
                                            game.Player2WordsFinished = false;
                                        }
                                        _context.MultiplayerGames.Update(game);
                                        await _context.SaveChangesAsync();
                                    }
                                }
                            }
                            transaction.Commit();
                            return ResponseWrapper<WordDto>.Success(wordDto);
                        }
                        transaction.Commit();
                        return ResponseWrapper<WordDto>.Error(AppConstants.WordDoesNotExist);
                    }
                    catch (Exception)
                    {
                        return ResponseWrapper<WordDto>.Error(AppConstants.WordDoesNotExist);
                    }
                }


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

        public async Task<ResponseWrapper<bool>> MoveToAsoc(GameAndUserDto request)
        {
            try
            {
                await _hubContext.Clients.Group(request.GameId.ToString()).MoveToAsoc();

                return ResponseWrapper<bool>.Success(true);
            }
            catch (Exception)
            {
                return ResponseWrapper<bool>.Error(AppConstants.FailedToAddWord);
            }
        }

        public async Task<ResponseWrapper<bool>> SpojniceSecondRound(GameAndUserDto request)
        {
            try
            {
                await _hubContext.Clients.Group(request.GameId.ToString()).SpojniceSecondRound();

                return ResponseWrapper<bool>.Success(true);
            }
            catch (Exception)
            {
                return ResponseWrapper<bool>.Error(AppConstants.FailedToAddWord);
            }
        }

        public async Task<ResponseWrapper<SpojniceRestAndShuffleDto>> GetSpojniceChecked(SpojniceRestAndShuffleDto spojniceResetDto)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == spojniceResetDto.MultiplayerGameDto.Id);
                    if (game != null)
                    {
                        var res = new SpojniceRestAndShuffleDto();
                        List<string> spojniceElements = game.SpojniceText.Split("$$").ToList();
                        List<ShuffledSpojnicaDto> list = new List<ShuffledSpojnicaDto>();
                        
                        foreach (var spojnica in spojniceElements)
                        {
                            ShuffledSpojnicaDto spojnicaDto = new ShuffledSpojnicaDto();
                            List<string> splittedSpojnica = spojnica.Split("##").ToList();
                            spojnicaDto.Left = splittedSpojnica[0];
                            spojnicaDto.Right = splittedSpojnica[1];
                            spojnicaDto.Correct = Convert.ToBoolean(splittedSpojnica[2]);
                            list.Add(spojnicaDto);
                        }

                        res.SpojniceShuffledState = list;

                        spojniceElements = game.SpojniceTextLeft.Split("$$").ToList();
                        list = new List<ShuffledSpojnicaDto>();

                        foreach (var spojnica in spojniceElements)
                        {
                            ShuffledSpojnicaDto spojnicaDto = new ShuffledSpojnicaDto();
                            List<string> splittedSpojnica = spojnica.Split("##").ToList();
                            spojnicaDto.Left = splittedSpojnica[0];
                            spojnicaDto.Right = splittedSpojnica[1];
                            spojnicaDto.Correct = Convert.ToBoolean(splittedSpojnica[2]);
                            list.Add(spojnicaDto);
                        }

                        res.SpojniceLeftSide = list;
                        return ResponseWrapper<SpojniceRestAndShuffleDto>.Success(res);
                    }

                    return ResponseWrapper<SpojniceRestAndShuffleDto>.Error(AppConstants.FailedToAddWord);
                }
                catch (Exception)
                {
                    return ResponseWrapper<SpojniceRestAndShuffleDto>.Error(AppConstants.FailedToAddWord);
                }
            }
        }

        public async Task<ResponseWrapper<SpojniceRestAndShuffleDto>> ResetSpojniceSaveShuffled(SpojniceRestAndShuffleDto spojniceResetDto)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    _context.Database.ExecuteSqlCommand("SELECT TOP 1 * FROM MultiplayerGames WITH (TABLOCKX, HOLDLOCK)");
                    var game = await _context.MultiplayerGames.FirstOrDefaultAsync(x => x.Id == spojniceResetDto.MultiplayerGameDto.Id);
                    if (game != null)
                    {
                        //List<string> combination = game.Combination.Split('-').ToList();
                        var spojList = string.Empty;
                        foreach (var spojnica in spojniceResetDto.SpojniceShuffledState.Select((value, i) => new { i, value }))
                        {
                            string spojnicaText = string.Empty;
                            spojnicaText += spojnica.value.Left + "##" + spojnica.value.Right + "##" + spojnica.value.Correct;
                            if (spojnica.i != spojniceResetDto.SpojniceShuffledState.Count - 1)
                            {
                                spojnicaText += "$$";
                            }
                            spojList += spojnicaText;
                        }

                        game.SpojniceText = spojList;

                        spojList = string.Empty;
                        foreach (var spojnica in spojniceResetDto.SpojniceLeftSide.Select((value, i) => new { i, value }))
                        {
                            string spojnicaText = string.Empty;
                            spojnicaText += spojnica.value.Left + "##" + spojnica.value.Right + "##" + spojnica.value.Correct;
                            if (spojnica.i != spojniceResetDto.SpojniceShuffledState.Count - 1)
                            {
                                spojnicaText += "$$";
                            }
                            spojList += spojnicaText;
                        }

                        game.SpojniceTextLeft = spojList;
                        _context.MultiplayerGames.Update(game);
                        await _context.SaveChangesAsync();
                        transaction.Commit();
                        await _hubContext.Clients.Group(spojniceResetDto.MultiplayerGameDto.Id.ToString()).SpojniceState2();
                        return ResponseWrapper<SpojniceRestAndShuffleDto>.Success(spojniceResetDto);
                    }

                    return ResponseWrapper<SpojniceRestAndShuffleDto>.Error(AppConstants.FailedToAddWord);
                }
                catch (Exception)
                {
                    return ResponseWrapper<SpojniceRestAndShuffleDto>.Error(AppConstants.FailedToAddWord);
                }
            }
        }

        public async Task<ResponseWrapper<List<WordDto>>> AddWordsUpload(List<WordDto> wordsDtos)
        {
            try
            {
                List<Word> words = _mapper.Map<List<Word>>(wordsDtos);
                words = words.Select(c =>
                {
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
