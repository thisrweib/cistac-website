using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Required for ToListAsync and other EF Core methods
using CistacApp.Data;     // Your DbContext namespace (ensure this matches your project)
using CistacApp.Models;   // Your Models namespace (ensure this matches your project)
using System.Collections.Generic; // Required for List<T>
using System.Linq; // Required for ToListAsync() and Any()
using System.Threading.Tasks; // Required for async operations

namespace CistacApp.Controllers // Ensure this matches your project's namespace
{
    [Route("api/[controller]")]
    [ApiController]
    public class HotelsController : Controller
    {
        private readonly CistacDbContext _context;

        public HotelsController(CistacDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            if (_context.Hotels == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Hotels' is null.");
            }
            List<Hotel> hotels = await _context.Hotels.ToListAsync();
            return View(hotels);
        }
    }
}


//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore; // Required for ToListAsync and other EF Core methods
//using CistacApp.Data;     // Your DbContext namespace (ensure this matches your project)
//using CistacApp.Models;   // Your Models namespace (ensure this matches your project)
//using System.Collections.Generic; // Required for List<T>
//using System.Linq; // Required for ToListAsync() and Any()
//using System.Threading.Tasks; // Required for async operations

//namespace CistacApp.Controllers // Ensure this matches your project's namespace
//{
//    public class HotelsController : Controller
//    {
//        private readonly CistacDbContext _context;

//        // Constructor: ApplicationDbContext is injected here by ASP.NET Core's dependency injection system
//        public HotelsController(CistacDbContext context)
//        {
//            _context = context;
//        }

//        // GET: /Hotels OR /Hotels/Index
//        // This action method handles requests to the URLs above.
//        public async Task<IActionResult> Index()
//        {
//            // Check if the Hotels DbSet in your DbContext is null before trying to query it.
//            // This is a defensive check, though typically it shouldn't be null if DbContext is set up correctly.
//            if (_context.Hotels == null)
//            {
//                // If there's no Hotels table/DbSet, return a Problem response.
//                // You could also return View(new List<Hotel>()); to show an empty page.
//                return Problem("Entity set 'ApplicationDbContext.Hotels' is null.");
//            }

//            // Asynchronously fetch all hotels from the database.
//            // ToListAsync() executes the query and returns a list of Hotel objects.
//            List<Hotel> hotels = await _context.Hotels.ToListAsync();

//            // Pass the list of hotels to the View.
//            // ASP.NET Core MVC will look for a view named "Index.cshtml" in the "Views/Hotels" folder.
//            return View(hotels);
//        }

//        // You can add more action methods here later for:
//        // - Displaying details of a single hotel (e.g., Details(int id))
//        // - Showing a form to create a new hotel (e.g., Create())
//        // - Handling the submission of the create form (e.g., Create(Hotel hotel))
//        // - Showing a form to edit an existing hotel (e.g., Edit(int id))
//        // - Handling the submission of the edit form (e.g., Edit(int id, Hotel hotel))
//        // - Showing a confirmation page for deleting a hotel (e.g., Delete(int id))
//        // - Handling the actual deletion (e.g., DeleteConfirmed(int id))
//    }
//}