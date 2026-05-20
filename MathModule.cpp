#include <iostream>
#include <cmath>

using namespace std;

int main()
{
    int radius;
    int height;

    cout<<"Enter the radius : ";
    cin>>radius;

    cout<<"Enter the height : ";
    cin>> height;

    double volume = 3.14 *pow(radius,2) * height;
    cout<< "Volume : " << volume<< endl;

    double s =sqrt((pow(radius,2)+ pow(height,2)));

    double area = (3.14 * pow(radius, 2)) + (3.14 * radius * s);
    
    double volume = (1.0 / 3) * 3.14 * pow(radius, 2) * height;

    cout << "s: " << s << endl;
    cout << "a: " << area << endl;
    cout << "v: " << volume << endl;

    return 0;

}