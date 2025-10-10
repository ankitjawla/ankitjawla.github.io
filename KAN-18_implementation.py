Got it!  
Here’s a simple **Python** script that checks the current time and displays it in a readable format.

```python
# time_check.py
from datetime import datetime

def check_time():
    # Get current date and time
    now = datetime.now()
    
    # Format time as HH:MM:SS
    current_time = now.strftime("%H:%M:%S")
    
    # Format date as YYYY-MM-DD
    current_date = now.strftime("%Y-%m-%d")
    
    print(f"Current Date: {current_date}")
    print(f"Current Time: {current_time}")

if __name__ == "__main__":
    check_time()
```

### How it works:
1. **`datetime.now()`** gets the current local date and time.
2. **`strftime()`** formats the date/time into a readable string.
3. The script prints both the date and time.

### Example Output:
```
Current Date: 2024-06-05
Current Time: 14:32:07
```

---

Do you want me to make it **continuously update the time every second** so it acts like a live clock?