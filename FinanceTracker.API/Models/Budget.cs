namespace FinanceTracker.API.Models
{ 
	public class Budget
	{
		public int Id { get; set; }
		public int userId { get; set; }
		public int Income { get; set; } = 0;
		public int Rent { get; set; } = 0;
		public int Utilities { get; set; } = 0;
		public int Groceries { get; set; } = 0;
		public int Transportation { get; set; } = 0;
		public int Entertainment { get; set; } = 0;
		public int Insurance { get; set; } = 0;
		public int Loans { get; set; } = 0;
		public int Savings { get; set; } = 0;
		public int Other { get; set; } = 0;

	}
}