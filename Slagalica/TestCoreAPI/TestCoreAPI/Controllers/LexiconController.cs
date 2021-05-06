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

namespace TestCoreAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class LexiconController : ControllerBase
    {
        private ILexiconService _lexiconService;
        public LexiconController(ILexiconService lexiconService)
        {
            _lexiconService = lexiconService;
        }

        [HttpGet]
        [Route("LexiconData")]
        //GET : /api/LexiconData
        public async Task<IActionResult> GetLexiconData()
        {
            var lexicons = await _lexiconService.GetLexicons();
            return Ok(lexicons.Data);
        }

        [HttpPost]
        [Route("RemoveLexicon")]
        //GET : /api/RemoveLexicon
        public async Task<IActionResult> RemoveLexicon([FromBody]LexiconDto lexiconDto)
        {
            var result = await _lexiconService.Delete(lexiconDto.Id.Value);
            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("SaveLexicon")]
        //GET : /api/SaveLexicon
        public async Task<IActionResult> InsertLexicon([FromBody]LexiconDto lexiconDto)
        {
            var result = new ResponseWrapper<List<LexiconDto>>();
            if (lexiconDto.Id != null)
            {
                result = await _lexiconService.Update(lexiconDto);
            }
            else
            {
                result = await _lexiconService.Insert(lexiconDto);
            }
            
            return result.IsSuccess ? (IActionResult)Ok(result.Data) : BadRequest(result.Errors);
        }
    }
}