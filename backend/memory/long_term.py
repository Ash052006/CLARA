import json
import os


class LongTermMemory:

    def __init__(self):

        self.file = "storage/memory.json"
        self.database_url = os.getenv("DATABASE_URL")

    def _connect(self):

        if not self.database_url:
            return None

        try:
            import psycopg
        except ImportError:
            return None

        return psycopg.connect(self.database_url)

    def _ensure_table(self, connection):

        with connection.cursor() as cursor:
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS clara_memory (
                    id INTEGER PRIMARY KEY,
                    data JSONB NOT NULL,
                    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
                )
                """
            )

        connection.commit()

    def save(self, data):

        connection = self._connect()

        if connection is not None:
            try:
                self._ensure_table(connection)

                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO clara_memory (id, data)
                        VALUES (1, %s::jsonb)
                        ON CONFLICT (id)
                        DO UPDATE SET
                            data = EXCLUDED.data,
                            updated_at = now()
                        """,
                        (json.dumps(data),),
                    )

                connection.commit()
                return
            except Exception as exc:
                print("Long-term database save failed:", repr(exc))
            finally:
                connection.close()

        os.makedirs(os.path.dirname(self.file), exist_ok=True)

        with open(
            self.file,
            "w"
        ) as f:

            json.dump(
                data,
                f,
                indent=4
            )

    def load(self):

        connection = self._connect()

        if connection is not None:
            try:
                self._ensure_table(connection)

                with connection.cursor() as cursor:
                    cursor.execute(
                        "SELECT data FROM clara_memory WHERE id = 1"
                    )
                    row = cursor.fetchone()

                if row is not None:
                    return row[0]
            except Exception as exc:
                print("Long-term database load failed:", repr(exc))
            finally:
                connection.close()

        try:

            with open(
                self.file,
                "r"
            ) as f:

                return json.load(f)

        except Exception:

            return {}
