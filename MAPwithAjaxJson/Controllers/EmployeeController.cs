using MAPwithAjaxJson.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MAPwithAjaxJson.Controllers
{
    public class EmployeeController : Controller
    {
        // GET: Employee
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult ViewAll()
        {
            return View(GetAllEmployee());
        }

        IEnumerable<Employee> GetAllEmployee()
        {
            using (DBModel db = new DBModel())
            {
                return db.Employees.ToList<Employee>();
            }
        }

        public ActionResult AddOrEdit( int id = 0)
        {
            Employee emp = new Employee();
            if (id != 0)
            {
                using (DBModel db = new DBModel())
                {
                    emp = db.Employees.Where(x => x.EmployeeId == id).FirstOrDefault<Employee>();
                }
            }
            return View(emp);
        }

        [HttpPost]
        public ActionResult AddOrEdit(Employee emp)
        {
            try
            {
                if (emp.ImageUpload != null)
                {
                    string filename = Path.GetFileNameWithoutExtension(emp.ImageUpload.FileName);
                    string extension = Path.GetExtension(emp.ImageUpload.FileName);
                    filename = filename + DateTime.Now.ToString("yymmssfff") + extension; //contatinate the extention at the End
                                                                                          //update property path
                    emp.ImagePath = "~/AppFiles/Images/" + filename;
                    //Save in the folder
                    emp.ImageUpload.SaveAs(Path.Combine(Server.MapPath("~/AppFiles/Images/"), filename));
                }
                //save the record into the Employee table
                using (DBModel db = new DBModel())
                {
                    if (emp.EmployeeId == 0)
                    {
                        //Save Data
                        db.Employees.Add(emp);
                        db.SaveChanges();
                    }
                    else
                    {
                        //Update Data
                        db.Entry(emp).State = EntityState.Modified;
                        db.SaveChanges();
                    }
                   
                }
                //return RedirectToAction("ViewAll");
                //to return a message if the saving is successful or Not
                return Json(new { success = true, html = GlobalClass.RenderRazorViewToString(this, "ViewAll", GetAllEmployee()), message = "Submitted Successfully" }, JsonRequestBehavior.AllowGet); //return the Json Data from the Ajax Jquery

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet); //If the Opperation is Not Successful

            }
        }
        public ActionResult Delete(int id)
        {
            try
            {
                using (DBModel db = new DBModel())
                {
                    Employee emp = db.Employees.Where(x => x.EmployeeId == id).FirstOrDefault<Employee>();
                    db.Employees.Remove(emp);
                    db.SaveChanges();
                }
                return Json(new { success = true, html = GlobalClass.RenderRazorViewToString(this, "ViewAll", GetAllEmployee()), message = "Deleted Successfully" }, JsonRequestBehavior.AllowGet); //return the Json Data from the Ajax Jquery

            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet); //If the Opperation is Not Successful

            }
        }
    }
}