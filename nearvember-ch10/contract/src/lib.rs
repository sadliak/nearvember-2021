use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen};
use figlet_rs::FIGfont;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(Default, BorshDeserialize, BorshSerialize)]
pub struct BannerGenerator {
}

#[near_bindgen]
impl BannerGenerator {
    pub fn generate_banner(&self, text: String) -> String {
        let log_message = format!("Generating banner with '{}' text ☑️", text);
        env::log(log_message.as_bytes());

        let standard_font = FIGfont::standand().unwrap();
        let figure = standard_font.convert(&text);
        let banner = figure.unwrap().to_string();
        env::log("Take a look at this magnificent banner 🤩🤩🤩".as_bytes());
        env::log(banner.as_bytes());

        return banner.to_string()
    }
}
