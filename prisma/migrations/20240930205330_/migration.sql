/*
  Warnings:

  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `kyc_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_images` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ratings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sold_properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_properties` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "kyc_documents" DROP CONSTRAINT "kyc_documents_userId_fkey";

-- DropForeignKey
ALTER TABLE "profiles" DROP CONSTRAINT "profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "property_documents" DROP CONSTRAINT "property_documents_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "property_images" DROP CONSTRAINT "property_images_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "ratings" DROP CONSTRAINT "ratings_userId_fkey";

-- DropForeignKey
ALTER TABLE "sold_properties" DROP CONSTRAINT "sold_properties_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "sold_properties" DROP CONSTRAINT "sold_properties_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_properties" DROP CONSTRAINT "user_properties_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "user_properties" DROP CONSTRAINT "user_properties_userId_fkey";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "kyc_documents";

-- DropTable
DROP TABLE "profiles";

-- DropTable
DROP TABLE "properties";

-- DropTable
DROP TABLE "property_documents";

-- DropTable
DROP TABLE "property_images";

-- DropTable
DROP TABLE "ratings";

-- DropTable
DROP TABLE "sold_properties";

-- DropTable
DROP TABLE "transactions";

-- DropTable
DROP TABLE "user_properties";

-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "auth_group" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,

    CONSTRAINT "auth_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_group_permissions" (
    "id" BIGSERIAL NOT NULL,
    "group_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "auth_group_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_permission" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "content_type_id" INTEGER NOT NULL,
    "codename" VARCHAR(100) NOT NULL,

    CONSTRAINT "auth_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authtoken_token" (
    "key" VARCHAR(40) NOT NULL,
    "created" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "authtoken_token_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "common_invoice" (
    "id" SERIAL NOT NULL,
    "payment_status" VARCHAR(225) NOT NULL,
    "payment_method" VARCHAR(225) NOT NULL,
    "note" TEXT,
    "issue_date" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionid_id" INTEGER NOT NULL,

    CONSTRAINT "common_invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_kycdocuments" (
    "id" SERIAL NOT NULL,
    "document_type" VARCHAR(225),
    "document_file" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL,
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userid_id" INTEGER NOT NULL,

    CONSTRAINT "common_kycdocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_profile" (
    "id" SERIAL NOT NULL,
    "company_logo" VARCHAR(100),
    "company_banner" VARCHAR(100),
    "company_address" VARCHAR(255),
    "title" VARCHAR(50),
    "description" TEXT NOT NULL,
    "instagram" VARCHAR(225),
    "linkedin" VARCHAR(225),
    "facebook" VARCHAR(225),
    "twitter" VARCHAR(225),
    "userid_id" INTEGER NOT NULL,

    CONSTRAINT "common_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_property" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "squaremeters" VARCHAR(255) NOT NULL,
    "property_type" VARCHAR(255) NOT NULL,
    "number_of_bathrooms" INTEGER,
    "number_of_bedrooms" INTEGER,
    "installment_duration" VARCHAR(255) NOT NULL,
    "payment_frequency" VARCHAR(255) NOT NULL,
    "down_payment" TEXT NOT NULL,
    "installment_payment_price" INTEGER NOT NULL,
    "keywords" TEXT[],
    "price" INTEGER NOT NULL,
    "is_sold" BOOLEAN NOT NULL DEFAULT false,
    "date_sold" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sellerid_id" INTEGER NOT NULL,

    CONSTRAINT "common_property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_propertydocuments" (
    "id" SERIAL NOT NULL,
    "document_type" VARCHAR(225),
    "img" VARCHAR(100),
    "file_path" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyid_id" INTEGER NOT NULL,

    CONSTRAINT "common_propertydocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_propertyimages" (
    "id" SERIAL NOT NULL,
    "img" VARCHAR(100),
    "propertyid_id" INTEGER NOT NULL,

    CONSTRAINT "common_propertyimages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_ratings" (
    "id" SERIAL NOT NULL,
    "comment" TEXT,
    "rate" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "propertyid_id" INTEGER NOT NULL,
    "userid_id" INTEGER NOT NULL,

    CONSTRAINT "common_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_soldproperties" (
    "id" SERIAL NOT NULL,
    "date_sold" TIMESTAMPTZ(6) NOT NULL,
    "buyerid_id" INTEGER NOT NULL,
    "propertyid_id" INTEGER NOT NULL,

    CONSTRAINT "common_soldproperties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_transactions" (
    "id" SERIAL NOT NULL,
    "status" VARCHAR(1) NOT NULL,
    "payment_method" VARCHAR(255) NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "propertyid_id" INTEGER NOT NULL,
    "userid_id" INTEGER NOT NULL,

    CONSTRAINT "common_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_user" (
    "password" VARCHAR(128) NOT NULL,
    "id" SERIAL NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "fname" VARCHAR(255) NOT NULL,
    "lname" VARCHAR(255) NOT NULL,
    "business_name" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "profile_picture" VARCHAR(100),
    "custom_url" VARCHAR(500),
    "is_company" BOOLEAN NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_staff" BOOLEAN NOT NULL,
    "is_superuser" BOOLEAN NOT NULL,
    "date_joined" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_login" TIMESTAMPTZ(6),
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "common_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_user_groups" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "common_user_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_user_user_permissions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "common_user_user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "common_userproperties" (
    "id" SERIAL NOT NULL,
    "date_purchased" TIMESTAMPTZ(6) NOT NULL,
    "propertyid_id" INTEGER NOT NULL,
    "userid_id" INTEGER NOT NULL,

    CONSTRAINT "common_userproperties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_realestatecompany" (
    "id" SERIAL NOT NULL,
    "custom_url" VARCHAR(255),
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "company_realestatecompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_auth_user" (
    "id" BIGSERIAL NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "last_login" TIMESTAMPTZ(6),
    "is_superuser" BOOLEAN NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "username" VARCHAR(150) NOT NULL,
    "user_type" VARCHAR(10) NOT NULL,
    "is_active" BOOLEAN NOT NULL,
    "is_staff" BOOLEAN NOT NULL,

    CONSTRAINT "custom_auth_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_auth_user_groups" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "group_id" INTEGER NOT NULL,

    CONSTRAINT "custom_auth_user_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_auth_user_user_permissions" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "custom_auth_user_user_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_admin_log" (
    "id" SERIAL NOT NULL,
    "action_time" TIMESTAMPTZ(6) NOT NULL,
    "object_id" TEXT,
    "object_repr" VARCHAR(200) NOT NULL,
    "action_flag" SMALLINT NOT NULL,
    "change_message" TEXT NOT NULL,
    "content_type_id" INTEGER,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "django_admin_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_content_type" (
    "id" SERIAL NOT NULL,
    "app_label" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,

    CONSTRAINT "django_content_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_migrations" (
    "id" BIGSERIAL NOT NULL,
    "app" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "applied" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "django_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "django_session" (
    "session_key" VARCHAR(40) NOT NULL,
    "session_data" TEXT NOT NULL,
    "expire_date" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "django_session_pkey" PRIMARY KEY ("session_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_name_key" ON "auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_name_a6ea08ec_like" ON "auth_group"("name");

-- CreateIndex
CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "auth_group_permissions"("group_id");

-- CreateIndex
CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "auth_group_permissions"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" ON "auth_group_permissions"("group_id", "permission_id");

-- CreateIndex
CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "auth_permission"("content_type_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_permission_content_type_id_codename_01ab375a_uniq" ON "auth_permission"("content_type_id", "codename");

-- CreateIndex
CREATE UNIQUE INDEX "authtoken_token_user_id_key" ON "authtoken_token"("user_id");

-- CreateIndex
CREATE INDEX "authtoken_token_key_10f0b77e_like" ON "authtoken_token"("key");

-- CreateIndex
CREATE INDEX "common_invoice_transactionid_id_58932cdd" ON "common_invoice"("transactionid_id");

-- CreateIndex
CREATE INDEX "common_kycdocuments_userid_id_a2364936" ON "common_kycdocuments"("userid_id");

-- CreateIndex
CREATE UNIQUE INDEX "common_profile_userid_id_key" ON "common_profile"("userid_id");

-- CreateIndex
CREATE INDEX "common_property_sellerid_id_bb9f30d0" ON "common_property"("sellerid_id");

-- CreateIndex
CREATE INDEX "common_propertydocuments_propertyid_id_05e247a2" ON "common_propertydocuments"("propertyid_id");

-- CreateIndex
CREATE INDEX "common_propertyimages_propertyid_id_2cf5711f" ON "common_propertyimages"("propertyid_id");

-- CreateIndex
CREATE INDEX "common_ratings_propertyid_id_0d36135f" ON "common_ratings"("propertyid_id");

-- CreateIndex
CREATE INDEX "common_ratings_userid_id_04409bdf" ON "common_ratings"("userid_id");

-- CreateIndex
CREATE INDEX "common_soldproperties_buyerid_id_fdb63b24" ON "common_soldproperties"("buyerid_id");

-- CreateIndex
CREATE INDEX "common_soldproperties_propertyid_id_f3741f3a" ON "common_soldproperties"("propertyid_id");

-- CreateIndex
CREATE INDEX "common_transactions_propertyid_id_5dfb9f92" ON "common_transactions"("propertyid_id");

-- CreateIndex
CREATE INDEX "common_transactions_userid_id_a026d2aa" ON "common_transactions"("userid_id");

-- CreateIndex
CREATE UNIQUE INDEX "common_user_email_key" ON "common_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "common_user_business_name_key" ON "common_user"("business_name");

-- CreateIndex
CREATE UNIQUE INDEX "common_user_phone_number_key" ON "common_user"("phone_number");

-- CreateIndex
CREATE INDEX "common_user_business_name_cc365e09_like" ON "common_user"("business_name");

-- CreateIndex
CREATE INDEX "common_user_email_10572c84_like" ON "common_user"("email");

-- CreateIndex
CREATE INDEX "common_user_phone_number_04aa6cec_like" ON "common_user"("phone_number");

-- CreateIndex
CREATE INDEX "common_user_groups_group_id_27a26245" ON "common_user_groups"("group_id");

-- CreateIndex
CREATE INDEX "common_user_groups_user_id_92ddbe7a" ON "common_user_groups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "common_user_groups_user_id_group_id_ba201ca9_uniq" ON "common_user_groups"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "common_user_user_permissions_permission_id_a6da427c" ON "common_user_user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "common_user_user_permissions_user_id_56b84879" ON "common_user_user_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "common_user_user_permiss_user_id_permission_id_5694f4c4_uniq" ON "common_user_user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE INDEX "common_userproperties_propertyid_id_29457a5e" ON "common_userproperties"("propertyid_id");

-- CreateIndex
CREATE INDEX "common_userproperties_userid_id_72db9650" ON "common_userproperties"("userid_id");

-- CreateIndex
CREATE UNIQUE INDEX "company_realestatecompany_user_id_key" ON "company_realestatecompany"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_auth_user_email_key" ON "custom_auth_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "custom_auth_user_username_key" ON "custom_auth_user"("username");

-- CreateIndex
CREATE INDEX "custom_auth_user_email_8e3f8ced_like" ON "custom_auth_user"("email");

-- CreateIndex
CREATE INDEX "custom_auth_user_username_bc76db7a_like" ON "custom_auth_user"("username");

-- CreateIndex
CREATE INDEX "custom_auth_user_groups_group_id_be8803b9" ON "custom_auth_user_groups"("group_id");

-- CreateIndex
CREATE INDEX "custom_auth_user_groups_user_id_0e71eb5f" ON "custom_auth_user_groups"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_auth_user_groups_user_id_group_id_07773560_uniq" ON "custom_auth_user_groups"("user_id", "group_id");

-- CreateIndex
CREATE INDEX "custom_auth_user_user_permissions_permission_id_0427cb51" ON "custom_auth_user_user_permissions"("permission_id");

-- CreateIndex
CREATE INDEX "custom_auth_user_user_permissions_user_id_f8893b66" ON "custom_auth_user_user_permissions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "custom_auth_user_user_pe_user_id_permission_id_e2cda069_uniq" ON "custom_auth_user_user_permissions"("user_id", "permission_id");

-- CreateIndex
CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "django_admin_log"("content_type_id");

-- CreateIndex
CREATE INDEX "django_admin_log_user_id_c564eba6" ON "django_admin_log"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "django_content_type_app_label_model_76bd3d3b_uniq" ON "django_content_type"("app_label", "model");

-- CreateIndex
CREATE INDEX "django_session_expire_date_a5c62663" ON "django_session"("expire_date");

-- CreateIndex
CREATE INDEX "django_session_session_key_c0390e0f_like" ON "django_session"("session_key");

-- AddForeignKey
ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "auth_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_group_permissions" ADD CONSTRAINT "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "auth_group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auth_permission" ADD CONSTRAINT "auth_permission_content_type_id_2f476e4b_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "authtoken_token" ADD CONSTRAINT "authtoken_token_user_id_35299eff_fk_common_user_id" FOREIGN KEY ("user_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_invoice" ADD CONSTRAINT "common_invoice_transactionid_id_58932cdd_fk_common_tr" FOREIGN KEY ("transactionid_id") REFERENCES "common_transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_kycdocuments" ADD CONSTRAINT "common_kycdocuments_userid_id_a2364936_fk_common_user_id" FOREIGN KEY ("userid_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_profile" ADD CONSTRAINT "common_profile_userid_id_b0b0445b_fk_common_user_id" FOREIGN KEY ("userid_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_property" ADD CONSTRAINT "common_property_sellerid_id_bb9f30d0_fk_common_user_id" FOREIGN KEY ("sellerid_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_propertydocuments" ADD CONSTRAINT "common_propertydocum_propertyid_id_05e247a2_fk_common_pr" FOREIGN KEY ("propertyid_id") REFERENCES "common_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_propertyimages" ADD CONSTRAINT "common_propertyimage_propertyid_id_2cf5711f_fk_common_pr" FOREIGN KEY ("propertyid_id") REFERENCES "common_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_ratings" ADD CONSTRAINT "common_ratings_propertyid_id_0d36135f_fk_common_property_id" FOREIGN KEY ("propertyid_id") REFERENCES "common_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_ratings" ADD CONSTRAINT "common_ratings_userid_id_04409bdf_fk_common_user_id" FOREIGN KEY ("userid_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_soldproperties" ADD CONSTRAINT "common_soldpropertie_propertyid_id_f3741f3a_fk_common_pr" FOREIGN KEY ("propertyid_id") REFERENCES "common_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_soldproperties" ADD CONSTRAINT "common_soldproperties_buyerid_id_fdb63b24_fk_common_user_id" FOREIGN KEY ("buyerid_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_transactions" ADD CONSTRAINT "common_transactions_propertyid_id_5dfb9f92_fk_common_pr" FOREIGN KEY ("propertyid_id") REFERENCES "common_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_transactions" ADD CONSTRAINT "common_transactions_userid_id_a026d2aa_fk_common_user_id" FOREIGN KEY ("userid_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_user_groups" ADD CONSTRAINT "common_user_groups_user_id_92ddbe7a_fk_common_user_id" FOREIGN KEY ("user_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_user_user_permissions" ADD CONSTRAINT "common_user_user_permissions_user_id_56b84879_fk_common_user_id" FOREIGN KEY ("user_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_userproperties" ADD CONSTRAINT "common_userpropertie_propertyid_id_29457a5e_fk_common_pr" FOREIGN KEY ("propertyid_id") REFERENCES "common_property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "common_userproperties" ADD CONSTRAINT "common_userproperties_userid_id_72db9650_fk_common_user_id" FOREIGN KEY ("userid_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "custom_auth_user_groups" ADD CONSTRAINT "custom_auth_user_groups_user_id_0e71eb5f_fk_custom_auth_user_id" FOREIGN KEY ("user_id") REFERENCES "custom_auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "custom_auth_user_user_permissions" ADD CONSTRAINT "custom_auth_user_use_user_id_f8893b66_fk_custom_au" FOREIGN KEY ("user_id") REFERENCES "custom_auth_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_content_type_id_c4bce8eb_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "django_content_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "django_admin_log" ADD CONSTRAINT "django_admin_log_user_id_c564eba6_fk_common_user_id" FOREIGN KEY ("user_id") REFERENCES "common_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
