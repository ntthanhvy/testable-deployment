import {
	Address,
	SoftDeletableEntity,
	generateEntityId,
} from "@medusajs/medusa";
import {
	BeforeInsert,
	Column,
	Entity,
	Index,
	JoinColumn,
	OneToOne,
} from "typeorm";

@Entity()
class StoreLocation extends SoftDeletableEntity {
	@Column()
	name: string;

	@Column()
	@Index({ unique: true })
	code: string;

	@Column({ type: "varchar" })
	address_id: string;

	@Column({ nullable: true })
	email: string | null;

	@OneToOne(() => Address)
	@JoinColumn({ name: "address_id" })
	address: Address;

	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "strLct");
	}
}

export default StoreLocation;
