public class PentagonalNumbers { 
public static void main(String[] args) { 
// Number of pentagonal numbers to display 
int n = 50; 
// Print the first n pentagonal numbers 
for (int i = 1; i <= n; i++) { 
// Calculate the  pentagonal number 
int pentagonalNumber = (3 * i * i - i) / 2; 
// Print the pentagonal number with a formatted space 
System.out.printf("%5d", pentagonalNumber); 
// New line after every 10 numbers 
if (i % 10 == 0) { 
System.out.println(); 
} 
} 
} 
} 
