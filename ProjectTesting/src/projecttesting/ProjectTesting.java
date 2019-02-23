/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package projecttesting;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 *
 * @author s531500
 */
public class ProjectTesting {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws InterruptedException {
        // TODO code application logic here
        String url = "http://localhost:8080";
        try
        {
         System.setProperty("webdriver.chrome.driver", "C:\\sravya\\Spring2019\\Selenium-Testing-set-up-tools\\chromedriver_win32\\chromedriver.exe");
            WebDriver driver = new ChromeDriver();
            driver.get(url);
            driver.manage().window().maximize();
	    driver.findElement(By.id("inputEmail")).sendKeys("admin@nwmissouri.edu");
            Thread.sleep(500);
            driver.findElement(By.id("inputPassword")).sendKeys("Admin@123");
            Thread.sleep(500);
            driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div/div/div[2]/div/div/form/button")).click();
            Thread.sleep(500);
            driver.close();
    }
       catch(Exception e)
       {
           System.out.println("Test Failed!!" + e);
       }
    }
}