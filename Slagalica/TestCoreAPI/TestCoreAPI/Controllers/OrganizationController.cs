using System;
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

        [HttpGet]
        [Route("LexiconData")]
        //GET : /api/LexiconData
        public async Task<IActionResult> GetLexiconData()
        {
            var lexicons = await _organizationService.GetLexicons();
            return Ok(lexicons.Data);
        }

        [HttpPost]
        [Route("RemoveLexicon")]
        //GET : /api/RemoveLexicon
        public async Task<IActionResult> RemoveLexicon([FromBody]WordDto lexiconDto)
        {
            var result = await _organizationService.Delete(lexiconDto.Id.Value);
            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("SaveLexicon")]
        //GET : /api/SaveLexicon
        public async Task<IActionResult> InsertLexicon([FromBody]WordDto lexiconDto)
        {
            var result = new ResponseWrapper<List<WordDto>>();
            if (lexiconDto.Id != null)
            {
                result = await _organizationService.Update(lexiconDto);
            }
            else
            {
                result = await _organizationService.Insert(lexiconDto);
            }

            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
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
        [Route("upload-image")]
        public async Task<IActionResult> UploadImageProfile(IFormCollection data, IFormFile imageFile)
        {
            var x = data["name"];
            var result = new ResponseWrapper<List<AssociationDto>>();
            //result = await _organizationService.AddAssocsUpload(assocsDtos);

            return result.IsSuccess ? (IActionResult)Ok(true) : BadRequest(true);
        }

        
    }
}