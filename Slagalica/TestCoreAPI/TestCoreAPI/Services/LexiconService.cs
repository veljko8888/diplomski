using AutoMapper;
using Img.ELicensing.Core;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TestCoreAPI.ApplicationConstants;
using TestCoreAPI.Dtos;
using TestCoreAPI.IServices;
using TestCoreAPI.Models;

namespace TestCoreAPI.Services
{
    public class LexiconService : ILexiconService
    {
        private ApplicationDbContext _context;
        private IMapper _mapper;
        public LexiconService(
            ApplicationDbContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ResponseWrapper<List<LexiconDto>>> GetLexicons()
        {
            try
            {
                List<Lexicon> lexiconsDb = await _context.Lexicons.ToListAsync();
                List<LexiconDto> lexicons = _mapper.Map<List<LexiconDto>>(lexiconsDb);
                return ResponseWrapper<List<LexiconDto>>.Success(lexicons);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<LexiconDto>>.Error(AppConstants.GetLexiconsFailed);
            }
        }

        public async Task<ResponseWrapper<List<LexiconDto>>> Delete(Guid lexiconId)
        {
            try
            {
                Lexicon lexiconRemove = _context.Lexicons.FirstOrDefault(x => x.Id == lexiconId);
                if (lexiconRemove != null)
                {
                    _context.Lexicons.Remove(lexiconRemove);
                    await _context.SaveChangesAsync();

                    List<Lexicon> lexiconsDb = await _context.Lexicons.ToListAsync();
                    List<LexiconDto> lexicons = _mapper.Map<List<LexiconDto>>(lexiconsDb);
                    return ResponseWrapper<List<LexiconDto>>.Success(lexicons);
                }

                return ResponseWrapper<List<LexiconDto>>.Error(AppConstants.FailedToDeleteLexicon);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<LexiconDto>>.Error(AppConstants.FailedToDeleteLexicon);
            }
        }

        public async Task<ResponseWrapper<List<LexiconDto>>> Insert(LexiconDto lexiconDto)
        {
            try
            {
                Lexicon lexicon = _mapper.Map<Lexicon>(lexiconDto);
                lexicon.Id = Guid.NewGuid();
                _context.Lexicons.Add(lexicon);
                await _context.SaveChangesAsync();

                List<Lexicon> lexiconsDb = await _context.Lexicons.ToListAsync();
                List<LexiconDto> lexicons = _mapper.Map<List<LexiconDto>>(lexiconsDb);
                return ResponseWrapper<List<LexiconDto>>.Success(lexicons);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<LexiconDto>>.Error(AppConstants.FailedToAddLexicon);
            }
        }

        public async Task<ResponseWrapper<List<LexiconDto>>> Update(LexiconDto lexiconDto)
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
                    List<LexiconDto> lexicons = _mapper.Map<List<LexiconDto>>(lexiconsDb);
                    return ResponseWrapper<List<LexiconDto>>.Success(lexicons);
                }

                return ResponseWrapper<List<LexiconDto>>.Error(AppConstants.FailedToUpdateLexicon);
            }
            catch (Exception)
            {
                return ResponseWrapper<List<LexiconDto>>.Error(AppConstants.FailedToUpdateLexicon);
            }
        }
    }
}
