/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package projecttesting;

import com.sun.java.swing.plaf.windows.resources.windows;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.util.Scanner;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

/**
 *
 * @author s531500
 */
public class ProjectTesting {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) throws InterruptedException, FileNotFoundException {
        Scanner scanid = new Scanner(new File("NorthwestIDs.txt"));
        Scanner scanpassword = new Scanner(new File("password.txt"));
        PrintWriter pwrt = new PrintWriter(new File("output.txt"));
    // Test Case 1
        String url = "http://localhost:8080";
        
        System.setProperty("webdriver.chrome.driver", "C:\\Users\\S531500\\Documents\\NetBeansProjects\\ProjectTesting\\chromedriver_win32\\chromedriver.exe");
        WebDriver driver = new ChromeDriver();
        driver.get(url);
        driver.manage().window().maximize();
               
        while (scanid.hasNext()) {  
            boolean flag = true;
            WebElement login = driver.findElement(By.id("inputEmail"));
            String str = scanid.next().concat("@nwmissouri.edu");
//            str.concat("@*.edu");
            login.clear();
            login.sendKeys(str);
                System.out.println(str);
            
            Thread.sleep(500);
            WebElement pwd = driver.findElement(By.id("inputPassword"));
            String str1 = scanpassword.next();
            pwd.clear();
            pwd.sendKeys(str1);
            Thread.sleep(500);
            driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div/div/div[2]/div/div/form/button")).click();
            String dummy = driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div/div/div[2]/div/div/form/div[1]")).getText();
            System.out.println(dummy);
            if(driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div/div/div[2]/div/div/form/div[1]")).getText().contains("Invalid User!!")){
                flag = false;
                System.out.println(flag);
            }
            
            Thread.sleep(1000);
            //driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div[2]/div/div[2]/a[3]/button/i")).click();
            Thread.sleep(1000);
                        
//             if (!url.equals(driver.getCurrentUrl())) {
//                driver.findElement(By.cssSelector("h2[title$='GRAD DIRECT PROJECT II 03FA18']")).click();
//                driver.findElement(By.partialLinkText("Workshops")).click();
//                Thread.sleep(1000);
//                pwrt.println(true);
//
//            }else{
//                pwrt.println(false);
//            }
//            driver.get(url);
            boolean contains = driver.getCurrentUrl().contains("instructordashboard");
            if(contains){
                Thread.sleep(1000);
                driver.findElement(By.xpath("//*[@id=\"app\"]/div/div/div[2]/div[1]/div/div[2]/a[3]/button")).click();
               Thread.sleep(1000);
                boolean containsDetails = driver.getCurrentUrl().contains("coursestudent");
                if(containsDetails){
                    System.out.println(true);
                }
            }
    }
        
             pwrt.close();
        scanid.close();
        scanpassword.close();
    driver.close();
            }
    
}
