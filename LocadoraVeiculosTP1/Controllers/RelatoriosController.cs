using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LocadoraVeiculosTP1.Data;
using System.Linq;
using System.Threading.Tasks;

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

        // Filtro 1: Inner Join simples (Veiculos e Fabricantes)
        [HttpGet("veiculos-com-marca")]
        public async Task<IActionResult> GetVeiculosMarcas()
        {
            var query = from v in _context.Veiculos
                        join f in _context.Fabricantes on v.FabricanteId equals f.Id
                        select new { v.Modelo, Marca = f.Nome, v.AnoFabricacao };
            return Ok(await query.ToListAsync());
        }

        // Filtro 2: Inner Join Duplo (Alugueis e Clientes)
        [HttpGet("alugueis-por-cliente")]
        public async Task<IActionResult> GetAlugueisClientes()
        {
            var query = from a in _context.Alugueis
                        join c in _context.Clientes on a.ClienteId equals c.Id
                        select new { a.Id, NomeCliente = c.Nome, a.ValorTotal };
            return Ok(await query.ToListAsync());
        }

        // Filtro 3: Left Join (Todos os fabricantes e seus modelos, mesmo se não houver estoque)
        [HttpGet("estoque-fabricantes")]
        public async Task<IActionResult> GetEstoque()
        {
            var query = from f in _context.Fabricantes
                        join v in _context.Veiculos on f.Id equals v.FabricanteId into grupo
                        from subVeiculo in grupo.DefaultIfEmpty()
                        select new { Fabricante = f.Nome, Carro = subVeiculo != null ? subVeiculo.Modelo : "Sem Estoque" };
            return Ok(await query.ToListAsync());
        }

        // Filtro 4: Inner Join Triplo (Aluguel, Veículo e Categoria)
        [HttpGet("alugueis-detalhado-categoria")]
        public async Task<IActionResult> GetAlugueisCat()
        {
            var query = from a in _context.Alugueis
                        join v in _context.Veiculos on a.VeiculoId equals v.Id
                        join cat in _context.Categorias on v.CategoriaId equals cat.Id
                        select new { a.Id, v.Modelo, Categoria = cat.Nome, a.ValorTotal };
            return Ok(await query.ToListAsync());
        }

        // Filtro 5: Join com Agrupamento (Faturamento total por cliente)
        [HttpGet("faturamento-total-clientes")]
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