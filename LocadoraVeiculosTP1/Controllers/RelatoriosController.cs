using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocadoraVeiculosTP1.Data;
using System.Linq;

namespace LocadoraVeiculosTP1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RelatoriosController : ControllerBase
    {
        private readonly LocadoraDbContext _context;

        public RelatoriosController(LocadoraDbContext context)
        {
            _context = context;
        }

        [HttpGet("veiculos-com-marca")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetVeiculosMarcas()
        {
            var query = from v in _context.Veiculos
                        join f in _context.Fabricantes on v.FabricanteId equals f.Id
                        select new { v.Modelo, Marca = f.Nome, v.AnoFabricacao };
            return Ok(await query.ToListAsync());
        }

        [HttpGet("alugueis-por-cliente")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAlugueisClientes()
        {
            var query = from a in _context.Alugueis
                        join c in _context.Clientes on a.ClienteId equals c.Id
                        select new { a.Id, NomeCliente = c.Nome, a.ValorTotal };
            return Ok(await query.ToListAsync());
        }

        [HttpGet("estoque-fabricantes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetEstoque()
        {
            var query = from f in _context.Fabricantes
                        join v in _context.Veiculos on f.Id equals v.FabricanteId into grupo
                        from subVeiculo in grupo.DefaultIfEmpty()
                        select new { Fabricante = f.Nome, Carro = subVeiculo != null ? subVeiculo.Modelo : "Sem Estoque" };
            return Ok(await query.ToListAsync());
        }

        [HttpGet("alugueis-detalhado-categoria")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAlugueisCat()
        {
            var query = from a in _context.Alugueis
                        join v in _context.Veiculos on a.VeiculoId equals v.Id
                        join cat in _context.Categorias on v.CategoriaId equals cat.Id
                        select new { a.Id, v.Modelo, Categoria = cat.Nome, a.ValorTotal };
            return Ok(await query.ToListAsync());
        }

        [HttpGet("faturamento-total-clientes")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetFaturamento()
        {
            var query = from a in _context.Alugueis
                        join c in _context.Clientes on a.ClienteId equals c.Id
                        group a by c.Nome into g
                        select new { Cliente = g.Key, TotalGasto = g.Sum(x => x.ValorTotal) };
            return Ok(await query.ToListAsync());
        }
    }
}