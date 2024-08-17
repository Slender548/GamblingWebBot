from datetime import datetime, timedelta, UTC

now = datetime.now(tz=UTC)

#Make shift 3 hours +

shift_start = now + timedelta(hours=48)

#Make shift 3 hours -

shift_end = now - timedelta(hours=3)

print(f"Shift start: {shift_start.strftime('%Y-%m-%d %H:%M:%S')}")
print(f"Shift end: {shift_end.strftime('%d-%m-%Y.%H:%M:%S.%f')[:-4]}")
