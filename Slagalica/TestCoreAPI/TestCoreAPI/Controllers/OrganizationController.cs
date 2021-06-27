﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Img.ELicensing.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TestCoreAPI.Dtos;
using TestCoreAPI.IServices;
using TestCoreAPI.Models;

namespace TestCoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrganizationController : ControllerBase
    {
        private IOrganizationService _organizationService;
        public OrganizationController(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }


        [HttpPost]
        [Route("get-daily-game")]
        public async Task<IActionResult> GetDailyGame(GetDailyGamesDto dailyGameDate)
        {
            var users = await _organizationService.GetDailyGamePlay(dailyGameDate.DailyGameDate);
            return Ok(users.Data);
        }

        [HttpGet]
        [Route("multiplayer-games")]
        public async Task<IActionResult> GetMultiplayerGames()
        {
            var users = await _organizationService.GetMultiplayerGames();
            return Ok(users.Data);
        }

        [HttpPost]
        [Route("create-multiplayer-game")]
        public async Task<IActionResult> CreateMultiplayerGame(MultiplayerGameDto multiGame)
        {
            var users = await _organizationService.CreateMultiplayerGame(multiGame);
            return Ok(users.Data);
        }

        [HttpPost]
        [Route("save-daily-play")]
        public async Task<IActionResult> SaveDailyPlay(DailyGamePlayDto gamePlay)
        {
            var users = await _organizationService.SaveDailyGamePlay(gamePlay);
            return Ok(users.Data);
        }

        [HttpGet]
        [Route("users-administration")]
        //GET : /api/LexiconData
        public async Task<IActionResult> GetUsers()
        {
            var users = await _organizationService.GetUsers();
            return Ok(users.Data);
        }

        [HttpPost]
        [Route("activate-deactivate")]
        public async Task<IActionResult> ActDeactUser([FromBody]UserDto userDto)
        {
            var result = new ResponseWrapper<List<UserDto>>();
            result = await _organizationService.ActivateDeactivateUser(userDto);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("daily-games")]
        public async Task<IActionResult> GetDailyGamesForDate(GetDailyGamesDto dailyGameDate)
        {
            var result = new ResponseWrapper<DailyGamesResponseDto>();
            result = await _organizationService.GetDailyGames(dailyGameDate);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("add-daily-game")]
        public async Task<IActionResult> AddDailyGame(DailyGameDto dailyGameDto)
        {
            var result = new ResponseWrapper<DailyGamesResponseDto>();
            result = await _organizationService.AddDailyGame(dailyGameDto);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("add-word")]
        public async Task<IActionResult> AddWord([FromBody]WordDto wordDto)
        {
            var result = new ResponseWrapper<WordDto>();
            result = await _organizationService.AddWord(wordDto);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("add-words-upload")]
        public async Task<IActionResult> AddWordsUpload([FromBody]List<WordDto> wordsDtos)
        {
            var result = new ResponseWrapper<List<WordDto>>();
            result = await _organizationService.AddWordsUpload(wordsDtos);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("add-connection-game")]
        public async Task<IActionResult> AddConnectionGame([FromBody]ConnectionDto connDto)
        {
            var result = new ResponseWrapper<ConnectionDto>();
            result = await _organizationService.AddConn(connDto);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("add-conns-games")]
        public async Task<IActionResult> AddConnectionsGames([FromBody]List<ConnectionDto> connsDtos)
        {
            var result = new ResponseWrapper<List<ConnectionDto>>();
            result = await _organizationService.AddConnsUpload(connsDtos);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("add-assoc-game")]
        public async Task<IActionResult> AddAssocGame([FromBody]AssociationDto assocDto)
        {
            var result = new ResponseWrapper<AssociationDto>();
            result = await _organizationService.AddAssoc(assocDto);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("add-assocs-games")]
        public async Task<IActionResult> AddAssocsGames([FromBody]List<AssociationDto> assocsDtos)
        {
            var result = new ResponseWrapper<List<AssociationDto>>();
            result = await _organizationService.AddAssocsUpload(assocsDtos);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("word-valid")]
        public async Task<IActionResult> CheckValidWord([FromBody]WordDto word)
        {
            var result = new ResponseWrapper<WordDto>();
            result = await _organizationService.CheckWordValid(word);

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

    }
}