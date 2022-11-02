import { Knex } from "knex";

const TabNamePinPageServicePinnedPage = "pin_page_service_pinned_page_tab";

export async function up(knex: Knex): Promise<void> {
    if (!(await knex.schema.hasTable(TabNamePinPageServicePinnedPage))) {
        await knex.schema.createTable(
            TabNamePinPageServicePinnedPage,
            (tab) => {
                tab.increments("pinned_page_id", { primaryKey: true });
                tab.integer("of_user_id").notNullable();
                tab.bigInteger("pin_time").notNullable();
                tab.text("url");
                tab.string("screenshot_filename", 256);
                tab.text("description");

                tab.index(
                    ["of_user_id", "pin_time"],
                    "pin_page_service_pinned_page_of_user_id_pin_time_idx"
                );
            }
        );
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable(TabNamePinPageServicePinnedPage);
}
