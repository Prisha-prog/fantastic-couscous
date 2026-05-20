#include <iostream>
#include <string>

using namespace std;

class Animal {
protected:
    string name;
    int age;

public:
    Animal(string _name, int _age) : name(_name), age(_age) {}

    void display() {
        cout << "Name: " << name << " Age: " << age << endl;
    }

    void makeSound() {
        cout << "Woof!! Woof!" << endl;
    }
};

class Dog : public Animal {
private:
    string breed;

public:
    Dog(string _name, int _age, string _breed) : Animal(_name, _age), breed(_breed) {}

    void displayDog() {
        cout << "Dog - ";
        display();
        cout << "Breed: " << breed << endl;
    }
};

int main() {
    Dog d("Buddy", 3, "Golden Retriever");
    d.displayDog();
    d.makeSound();
    return 0;
}
