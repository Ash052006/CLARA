from brain.reasoning.chat_manager import ChatManager

chat = ChatManager()

while True:

    question = input("You: ")

    if question.lower() == "exit":
        break

    answer = chat.chat(question)

    print("\nCLARA:", answer)
    print()