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
    public class FabricantesController : ControllerBase
    {
        private readonly LocadoraDbContext _context;

        public FabricantesController(LocadoraDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Fabricante>>> GetFabricantes()
        {
            return await _context.Fabricantes.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Fabricante>> GetFabricante(int id)
        {
            var fabricante = await _context.Fabricantes.FindAsync(id);
            if (fabricante == null) return NotFound();
            return fabricante;
        }

        [HttpPost]
        public async Task<ActionResult<Fabricante>> PostFabricante(Fabricante fabricante)
        {
            if (string.IsNullOrWhiteSpace(fabricante.Nome)) return BadRequest("Nome é obrigatório.");

            _context.Fabricantes.Add(fabricante);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFabricante), new { id = fabricante.Id }, fabricante);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFabricante(int id, Fabricante fabricante)
        {
            if (id != fabricante.Id) return BadRequest();
            _context.Entry(fabricante).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFabricante(int id)
        {
            var fabricante = await _context.Fabricantes.FindAsync(id);
            if (fabricante == null) return NotFound();
            _context.Fabricantes.Remove(fabricante);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}