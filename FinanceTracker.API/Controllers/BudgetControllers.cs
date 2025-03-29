using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FinanceTracker.API.DTO;
using FinanceTracker.API.Models;
using FinanceTracker.API.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;


[ApiController]
[Route("api/[controller]")]
public class BudgetController : ControllerBase
{
    private readonly AppDbContext _context;
   

    public BudgetController(AppDbContext context)
    {
        _context = context;
        

    }

    [HttpPost("create")]
    public async Task<IActionResult> CreateBudget(BudgetDto request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var budget = new Budget
        {
            userId = userId,
            Income = request.Income,
            Rent = request.Rent,
            Utilities = request.Utilities,
            Groceries = request.Groceries,
            Transportation = request.Transportation,
            Entertainment = request.Entertainment,
            Insurance = request.Insurance,
            Loans = request.Loans,
            Savings = request.Savings,
            Other = request.Other
        };
        _context.Budget.Add(budget);
        await _context.SaveChangesAsync();
        return Ok("Budget created successfully.");
    }

    [HttpPut("update")]
    public async Task<IActionResult> UpdateBudget(BudgetDto request)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        var budget = await _context.Budget.FirstOrDefaultAsync(b => b.userId == userId);
        if (budget == null)
        {
            return NotFound("Budget not found.");
        }
        budget.Income = request.Income;
        budget.Rent = request.Rent;
        budget.Utilities = request.Utilities;
        budget.Groceries = request.Groceries;
        budget.Transportation = request.Transportation;
        budget.Entertainment = request.Entertainment;
        budget.Insurance = request.Insurance;
        budget.Loans = request.Loans;
        budget.Savings = request.Savings;
        budget.Other = request.Other;
        await _context.SaveChangesAsync();
        return Ok("Budget updated successfully.");
    }

    [HttpGet("getBudget")]
    public async Task<IActionResult> GetBudget()
    {
        var userClaim = User.FindFirst(ClaimTypes.NameIdentifier);

        if (userClaim == null)
        {
            return Unauthorized("User is not authenticated.");
        }

        if (!int.TryParse(userClaim.Value, out var userId))
        {
            return BadRequest("Invalid user ID.");
        }

        var budget = await _context.Budget.FirstOrDefaultAsync(b => b.userId == userId);

        if (budget == null)
        {
            return NotFound("Budget not found.");
        }

        return Ok(budget);
    }



}
