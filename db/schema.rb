# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_09_194741) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "languages", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.string "code"
    t.datetime "created_at", null: false
    t.boolean "custom", default: false, null: false
    t.string "name", null: false
    t.string "native_name"
    t.integer "position", default: 0, null: false
    t.string "proficiency", default: "beginner", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_languages_on_user_id"
  end

  create_table "practice_attempts", force: :cascade do |t|
    t.integer "attempt_number"
    t.boolean "correct"
    t.datetime "created_at", null: false
    t.bigint "practice_session_id", null: false
    t.integer "response_time_ms"
    t.datetime "updated_at", null: false
    t.bigint "word_id", null: false
    t.index ["practice_session_id"], name: "index_practice_attempts_on_practice_session_id"
    t.index ["word_id"], name: "index_practice_attempts_on_word_id"
  end

  create_table "practice_sessions", force: :cascade do |t|
    t.datetime "completed_at"
    t.integer "correct_count", default: 0
    t.datetime "created_at", null: false
    t.integer "duration_seconds"
    t.integer "incorrect_count", default: 0
    t.bigint "language_id"
    t.string "session_type", default: "flashcard", null: false
    t.integer "skipped_count", default: 0
    t.datetime "started_at"
    t.bigint "stash_id"
    t.string "status", default: "in_progress", null: false
    t.integer "total_words", default: 0
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.integer "words_seen", default: 0
    t.index ["language_id"], name: "index_practice_sessions_on_language_id"
    t.index ["stash_id"], name: "index_practice_sessions_on_stash_id"
    t.index ["user_id"], name: "index_practice_sessions_on_user_id"
  end

  create_table "stashes", force: :cascade do |t|
    t.string "color", default: "brand"
    t.datetime "created_at", null: false
    t.string "description"
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id", "name"], name: "index_stashes_on_user_id_and_name", unique: true
    t.index ["user_id"], name: "index_stashes_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "admin", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "current_period_end"
    t.datetime "current_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "first_name"
    t.string "last_name"
    t.datetime "last_sign_in_at"
    t.string "last_sign_in_ip"
    t.string "provider"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.integer "sign_in_count", default: 0, null: false
    t.string "stripe_customer_id"
    t.string "stripe_price_id"
    t.string "stripe_subscription_id"
    t.string "subscription_status"
    t.datetime "trial_ends_at"
    t.string "uid"
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["provider", "uid"], name: "index_users_on_provider_and_uid", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["stripe_customer_id"], name: "index_users_on_stripe_customer_id", unique: true
  end

  create_table "word_stashes", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "stash_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "word_id", null: false
    t.index ["stash_id"], name: "index_word_stashes_on_stash_id"
    t.index ["word_id", "stash_id"], name: "index_word_stashes_on_word_id_and_stash_id", unique: true
    t.index ["word_id"], name: "index_word_stashes_on_word_id"
  end

  create_table "words", force: :cascade do |t|
    t.string "alternative_translations"
    t.datetime "created_at", null: false
    t.text "example_sentence"
    t.text "example_translation"
    t.string "formality"
    t.string "gender"
    t.bigint "language_id", null: false
    t.datetime "last_reviewed_at"
    t.integer "mastery_level", default: 0, null: false
    t.datetime "next_review_at"
    t.text "notes"
    t.string "part_of_speech"
    t.string "pitch_accent"
    t.string "plural"
    t.string "pronunciation"
    t.string "register"
    t.string "romanization"
    t.string "source"
    t.string "term", null: false
    t.integer "times_correct", default: 0, null: false
    t.integer "times_reviewed", default: 0, null: false
    t.string "translation", null: false
    t.datetime "updated_at", null: false
    t.text "usage_notes"
    t.bigint "user_id", null: false
    t.index ["language_id"], name: "index_words_on_language_id"
    t.index ["next_review_at"], name: "index_words_on_next_review_at"
    t.index ["user_id", "language_id"], name: "index_words_on_user_id_and_language_id"
    t.index ["user_id"], name: "index_words_on_user_id"
  end

  add_foreign_key "languages", "users"
  add_foreign_key "practice_attempts", "practice_sessions"
  add_foreign_key "practice_attempts", "words"
  add_foreign_key "practice_sessions", "languages"
  add_foreign_key "practice_sessions", "stashes"
  add_foreign_key "practice_sessions", "users"
  add_foreign_key "stashes", "users"
  add_foreign_key "word_stashes", "stashes"
  add_foreign_key "word_stashes", "words"
  add_foreign_key "words", "languages"
  add_foreign_key "words", "users"
end
