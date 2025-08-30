import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'role_menu_option' })
export class RoleMenuOptionEntity {

  @PrimaryColumn({ name: 'role_code', type: 'varchar', length: 10 })
  roleCode: string;

  @PrimaryColumn({ name: 'menu_option_code', type: 'varchar', length: 10 })
  menuOptionCode: string;

}