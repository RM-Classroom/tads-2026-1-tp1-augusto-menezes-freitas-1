using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocadoraVeiculosTP1.Data;
using LocadoraVeiculosTP1.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LocadoraVeiculosTP1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlugueisController : ControllerBase
    {
        private readonly LocadoraDbContext _context;

        public AlugueisController(LocadoraDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Aluguel>>> GetAlugueis()
        {
            return await _context.Alugueis.Include(a => a.Cliente).Include(a => a.Veiculo).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Aluguel>> GetAluguel(int id)
        {
            var aluguel = await _context.Alugueis.FindAsync(id);
            if (aluguel == null) return NotFound();
            return aluguel;
        }

        [HttpPost]
        public async Task<ActionResult<Aluguel>> PostAluguel(Aluguel aluguel)
        {
            if (aluguel.DataDevolucao < aluguel.DataInicio)
                return BadRequest("A data de devolução não pode ser anterior à data de início.");

            _context.Alugueis.Add(aluguel);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAluguel), new { id = aluguel.Id }, aluguel);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAluguel(int id, Aluguel aluguel)
        {
            if (id != aluguel.Id) return BadRequest();
            _context.Entry(aluguel).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAluguel(int id)
        {
            var aluguel = await _context.Alugueis.FindAsync(id);
            if (aluguel == null) return NotFound();
            _context.Alugueis.Remove(aluguel);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}