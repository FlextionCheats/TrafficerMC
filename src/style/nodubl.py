filename = input("Введите название файла: ")

with open(filename, 'r') as file:
    lines = file.readlines()

lines_set = set(lines)

with open(filename, 'w') as file:
    file.writelines(sorted(lines_set))

print("Удалено дубликатов:", len(lines) - len(lines_set))