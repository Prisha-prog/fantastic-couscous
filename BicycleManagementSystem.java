import java.util.ArrayList;
import java.util.Scanner;

class Bicycle {
    String name;
    String make;
    String type;
    boolean available;

    public Bicycle(String name, String make, String type) {
        this.name = name;
        this.make = make;
        this.type = type;
        this.available = true;
    }

    public String toString() {
        return "Name: " + name + ", Make: " + make + ", Type: " + type + ", Available: " + available;
    }
}

class User {
    String name;
    String id;
    ArrayList<Bicycle> borrowedBikes;

    public User(String name, String id) {
        this.name = name;
        this.id = id;
        borrowedBikes = new ArrayList<>();
    }

    public int getMaxBikes() {
        return 1;
    }

    public void borrowBike(Bicycle bike) {
        if (bike.available) {
            if (borrowedBikes.size() < getMaxBikes()) {
                borrowedBikes.add(bike);
                bike.available = false;
            } else {
                System.out.println("Borrowing limit reached.");
            }
        } else {
            System.out.println("This bicycle is currently unavailable.");
        }
    }

    public void returnBike(int index) {
        if (index >= 0 && index < borrowedBikes.size()) {
            Bicycle bike = borrowedBikes.get(index);
            bike.available = true;
            borrowedBikes.remove(index);
        } else {
            System.out.println("Invalid index.");
        }
    }

    public void displayBorrowedBikes() {
        if (borrowedBikes.isEmpty()) {
            System.out.println("No bikes borrowed.");
        } else {
            for (int i = 0; i < borrowedBikes.size(); i++) {
                System.out.println((i + 1) + ". " + borrowedBikes.get(i).toString());
            }
        }
    }
}

class FamilyUser extends User {
    public FamilyUser(String name, String id) {
        super(name, id);
    }

    @Override
    public int getMaxBikes() {
        return 2;
    }
}

public class BicycleManagementSystem {
    static Bicycle[][] bikeInventory = new Bicycle[2][50];
    static int adultCount = 0;
    static int childrenCount = 0;
    static ArrayList<User> userList = new ArrayList<>();
    static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        while (true) {
            System.out.println("\n===== E-Hailing Bicycle Management System =====");
            System.out.println("1. Add Bicycle");
            System.out.println("2. View Bicycles");
            System.out.println("3. Borrow Bicycle");
            System.out.println("4. Return Bicycle");
            System.out.println("5. Display Borrowed Bicycles");
            System.out.println("6. Search Bicycle");
            System.out.println("7. Exit");
            System.out.print("Enter your choice: ");

            int choice = Integer.parseInt(scanner.nextLine());
            switch (choice) {
                case 1:
                    addBicycle();
                    break;
                case 2:
                    viewBicycles();
                    break;
                case 3:
                    borrowBicycle();
                    break;
                case 4:
                    returnBicycle();
                    break;
                case 5:
                    displayBorrowedBicycles();
                    break;
                case 6:
                    searchBicycle();
                    break;
                case 7:
                    System.out.println("Exiting system. Goodbye!");
                    scanner.close();
                    System.exit(0);
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
    }

    static void addBicycle() {
        System.out.print("Enter Bicycle Name: ");
        String name = scanner.nextLine();
        System.out.print("Enter Bicycle Make: ");
        String make = scanner.nextLine();
        System.out.print("Enter Bicycle Type (Adult/Children): ");
        String type = scanner.nextLine();

        if (type.equalsIgnoreCase("Adult")) {
            if (adultCount < bikeInventory[0].length) {
                bikeInventory[0][adultCount] = new Bicycle(name, make, "Adult");
                adultCount++;
                System.out.println("Adult Bicycle added successfully.");
            } else {
                System.out.println("No space for Adult Bicycle.");
            }
        } else if (type.equalsIgnoreCase("Children")) {
            if (childrenCount < bikeInventory[1].length) {
                bikeInventory[1][childrenCount] = new Bicycle(name, make, "Children");
                childrenCount++;
                System.out.println("Children Bicycle added successfully.");
            } else {
                System.out.println("No space for Children Bicycle.");
            }
        } else {
            System.out.println("Invalid bicycle type. Must be Adult or Children.");
        }
    }

    static void viewBicycles() {
        System.out.println("\n----- Adult Bicycles -----");
        if (adultCount == 0) {
            System.out.println("No adult bicycles.");
        } else {
            for (int i = 0; i < adultCount; i++) {
                System.out.println((i + 1) + ". " + bikeInventory[0][i]);
            }
        }

        System.out.println("----- Children Bicycles -----");
        if (childrenCount == 0) {
            System.out.println("No children bicycles.");
        } else {
            for (int i = 0; i < childrenCount; i++) {
                System.out.println((i + 1) + ". " + bikeInventory[1][i]);
            }
        }
    }

    static void borrowBicycle() {
        System.out.print("Are you a Single user or Family user? (single/family): ");
        String userType = scanner.nextLine();

        System.out.print("Enter your Name: ");
        String name = scanner.nextLine();
        System.out.print("Enter your ID: ");
        String id = scanner.nextLine();

        User user = null;
        for (User u : userList) {
            if (u.id.equals(id)) {
                user = u;
                break;
            }
        }

        if (user != null) {
            if (!user.name.equals(name)) {
                System.out.println("User ID exists but name does not match. Cannot proceed.");
                return;
            }
            boolean isFamily = userType.equalsIgnoreCase("family");
            if (isFamily && !(user instanceof FamilyUser)) {
                System.out.println("User ID already exists as a Single user.");
                return;
            } else if (!isFamily && user instanceof FamilyUser) {
                System.out.println("User ID already exists as a Family user.");
                return;
            }
        } else {
            user = userType.equalsIgnoreCase("family") ? new FamilyUser(name, id) : new User(name, id);
        }

        int maxBikes = user.getMaxBikes();
        int remainingSlots = maxBikes - user.borrowedBikes.size();

        if (remainingSlots <= 0) {
            System.out.println("You have reached your borrowing limit.");
            return;
        }

        System.out.println("You can borrow up to " + remainingSlots + " more bicycle(s).");

        for (int i = 0; i < remainingSlots; i++) {
            System.out.print("Do you want to borrow a bicycle? (yes/no): ");
            if (!scanner.nextLine().equalsIgnoreCase("yes")) {
                break;
            }

            String requiredType;
            if (user instanceof FamilyUser) {
                System.out.print("Is this bicycle for an Adult or a Child? ");
                String rider = scanner.nextLine();
                if (rider.equalsIgnoreCase("Child")) {
                    int age = getValidIntegerInput("Enter child's age: ", 1, 120);
                    requiredType = (age < 18) ? "Children" : "Adult";
                } else {
                    requiredType = "Adult";
                }
            } else {
                int age = getValidIntegerInput("Enter your age: ", 1, 120);
                requiredType = (age < 18) ? "Children" : "Adult";
            }

            boolean hasType = false;
            for (Bicycle b : user.borrowedBikes) {
                if (b.type.equalsIgnoreCase(requiredType)) {
                    hasType = true;
                    break;
                }
            }

            if (hasType) {
                System.out.println("You already have a " + requiredType + " bicycle.");
                continue;
            }

            ArrayList<Integer> availableIndices = new ArrayList<>();
            int category = requiredType.equalsIgnoreCase("Adult") ? 0 : 1;
            int count = category == 0 ? adultCount : childrenCount;

            System.out.println("Available " + requiredType + " Bicycles:");
            for (int j = 0; j < count; j++) {
                if (bikeInventory[category][j] != null && bikeInventory[category][j].available) {
                    System.out.println((availableIndices.size() + 1) + ". " + bikeInventory[category][j]);
                    availableIndices.add(j);
                }
            }

            if (availableIndices.isEmpty()) {
                System.out.println("No available " + requiredType + " bicycles.");
                continue;
            }

            int selection = getValidIntegerInput("Select bicycle number: ", 1, availableIndices.size());
            int index = availableIndices.get(selection - 1);
            Bicycle selectedBike = bikeInventory[category][index];
            user.borrowBike(selectedBike);
        }

        if (!user.borrowedBikes.isEmpty() && !userList.contains(user)) {
            userList.add(user);
        }
        System.out.println(user.borrowedBikes.isEmpty() ? "No bicycles borrowed." : "Bicycles borrowed successfully.");
    }

    static void returnBicycle() {
        System.out.print("Enter your User ID: ");
        String uid = scanner.nextLine();

        User user = null;
        for (User u : userList) {
            if (u.id.equals(uid)) {
                user = u;
                break;
            }
        }

        if (user == null || user.borrowedBikes.isEmpty()) {
            System.out.println("No borrowed bicycles found for this user.");
            return;
        }

        System.out.println("Your borrowed bicycles:");
        user.displayBorrowedBikes();

        int selection = getValidIntegerInput("Enter bicycle number to return: ", 1, user.borrowedBikes.size());
        user.returnBike(selection - 1);
        System.out.println("Bicycle returned successfully.");
    }

    static void displayBorrowedBicycles() {
        if (userList.isEmpty()) {
            System.out.println("No users have borrowed bicycles.");
            return;
        }

        for (User user : userList) {
            System.out.println("\nUser: " + user.name + " (ID: " + user.id + ")");
            user.displayBorrowedBikes();
        }
    }

    static void searchBicycle() {
        System.out.print("Enter bicycle name to search: ");
        String searchName = scanner.nextLine().trim().toLowerCase();
        boolean found = false;

        System.out.println("\nAdult Bicycles:");
        for (int i = 0; i < adultCount; i++) {
            Bicycle bike = bikeInventory[0][i];
            if (bike != null && bike.name.toLowerCase().contains(searchName)) {
                System.out.println(bike);
                found = true;
            }
        }

        System.out.println("\nChildren Bicycles:");
        for (int i = 0; i < childrenCount; i++) {
            Bicycle bike = bikeInventory[1][i];
            if (bike != null && bike.name.toLowerCase().contains(searchName)) {
                System.out.println(bike);
                found = true;
            }
        }

        if (!found) {
            System.out.println("No bicycles found matching '" + searchName + "'");
        }
    }

    static int getValidIntegerInput(String prompt, int min, int max) {
        int input = 0;
        boolean valid = false;
        while (!valid) {
            System.out.print(prompt);
            try {
                input = Integer.parseInt(scanner.nextLine());
                if (input >= min && input <= max) {
                    valid = true;
                } else {
                    System.out.println("Input must be between " + min + " and " + max + ".");
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid input. Please enter a number.");
            }
        }
        return input;
    }
}
