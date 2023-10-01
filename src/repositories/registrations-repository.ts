import { Prisma, Registration } from "@prisma/client";

export interface RegistrationRepository {
    create(data: Prisma.RegistrationUncheckedCreateInput): Promise<Registration>
}