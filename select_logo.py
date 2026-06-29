import tkinter as tk
from tkinter import filedialog
import shutil
import os
import sys

def main():
    root = tk.Tk()
    root.withdraw() # Hide the main window
    root.attributes('-topmost', True) # Bring dialog to front
    
    file_path = filedialog.askopenfilename(
        title="Select the Velora Travel Logo",
        filetypes=[("Image files", "*.png *.jpg *.jpeg")]
    )
    
    if file_path:
        dest_dir = os.path.join(os.getcwd(), 'public', 'images')
        os.makedirs(dest_dir, exist_ok=True)
        dest_path = os.path.join(dest_dir, 'logo.png')
        
        try:
            shutil.copy2(file_path, dest_path)
            print("SUCCESS")
        except Exception as e:
            print(f"ERROR: {e}")
    else:
        print("CANCELLED")

if __name__ == "__main__":
    main()
