import { SoftDeletableEntity, generateEntityId } from "@medusajs/medusa";
import {
	BeforeInsert,
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from "typeorm";

export enum PageStatus {
	PUBLISHED = "published",
	DRAFT = "draft",
}

@Entity()
class Page extends SoftDeletableEntity {
	@Column()
	title: string;

	@Column()
	@Index({ unique: true })
	slug: string;

	@Column({ type: "text" })
	body: string;

	@Column({ type: "enum", enum: PageStatus, default: PageStatus.DRAFT })
	status: PageStatus;

	@Column({ nullable: true })
	parent_id: string;

	@ManyToOne(() => Page, (page) => page.children, {
		nullable: true,
		onDelete: "SET NULL",
	})
	@JoinColumn({ name: "parent_id" })
	parent: Page;

	@OneToMany(() => Page, (page) => page.parent)
	children: Page[];

	@Column({ default: 0 })
	order: number;

	@BeforeInsert()
	private beforeInsert(): void {
		this.id = generateEntityId(this.id, "page");
	}
}

export default Page;
