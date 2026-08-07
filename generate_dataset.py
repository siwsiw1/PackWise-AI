import random
import json
import csv
import openpyxl

TOY_SERIES = [
    ("Glamour Doll Series", "Fashion Doll", (120, 220), (25, 32), ["Crown", "Handbag", "Shoes", "Comb", "Necklace", "Sunglasses"]),
    ("Cyber Hero Action Figures", "Action Figure", (250, 450), (18, 28), ["Laser Blaster", "Shield", "Armor Pads", "Helmets"]),
    ("Chibi Animals Playset", "Miniature Playset", (60, 140), (10, 16), ["Mini Food Bowl", "Brush", "Tiny Toy", "Stickers", "Ribbon"]),
    ("Mecha Defender Titan", "Heavy High-End Figure", (500, 950), (28, 40), ["Giant Sword", "Missile Launcher", "Wing Attachments", "Extra Hands"]),
    ("Plush Pals Collector", "Plushie with Accessories", (90, 180), (15, 24), ["Mini Bell", "Hat", "Purse"]),
    ("Kingdom Knights", "Action Figure", (200, 380), (20, 30), ["Broadsword", "Banner", "Cape", "Dagger"]),
    ("Fantasy Princess Collection", "Fashion Doll", (140, 260), (26, 34), ["Magic Wand", "Slipper", "Tiara", "Ring", "Mirror"]),
    ("Space Explorer Squad", "Miniature Playset", (110, 210), (12, 18), ["Oxygen Tank", "Raygun", "Alien Companion"]),
]

POSES = ["Low", "Medium", "High"]
COGS = ["Center", "Top-Heavy", "Back-Heavy"]

def generate_50_samples():
    random.seed(42)
    rows = []
    json_data = []
    
    sku_counter = 1001
    
    for i in range(50):
        series_name, category, weight_range, height_range, possible_accs = random.choice(TOY_SERIES)
        prod_name = f"{series_name} - Model #{sku_counter}"
        sku_id = f"SKU-{sku_counter}"
        sku_counter += 1
        
        weight = random.randint(*weight_range)
        height = random.randint(*height_range)
        pose_complexity = random.choice(POSES)
        cog = random.choice(COGS)
        
        num_accs = random.randint(0, len(possible_accs))
        has_small_accs = "Y" if num_accs > 1 and random.random() > 0.3 else "N"
        
        # Comprehensive matrix of strap setups (15 distinct combinations)
        STRAP_PATTERNS = [
            ("N", "N", "N", "N"), # 0-strap (Unrestrained control)
            ("Y", "N", "N", "N"), # Head only
            ("N", "Y", "N", "N"), # Waist only
            ("N", "N", "Y", "N"), # Arm only
            ("N", "N", "N", "Y"), # Leg only
            ("Y", "Y", "N", "N"), # Head + Waist
            ("Y", "N", "N", "Y"), # Head + Leg
            ("Y", "N", "Y", "N"), # Head + Arm
            ("N", "Y", "Y", "N"), # Waist + Arm
            ("N", "Y", "N", "Y"), # Waist + Leg
            ("N", "N", "Y", "Y"), # Arm + Leg
            ("Y", "Y", "Y", "N"), # Head + Waist + Arm
            ("Y", "Y", "N", "Y"), # Head + Waist + Leg
            ("N", "Y", "Y", "Y"), # Waist + Arm + Leg
            ("Y", "Y", "Y", "Y"), # 4-Point Full Setup
        ]
        
        # Cycle through strap patterns deterministically across the 50 SKUs
        head_strap, waist_strap, arm_strap, leg_strap = STRAP_PATTERNS[i % len(STRAP_PATTERNS)]
        
        strap_count = [head_strap, waist_strap, arm_strap, leg_strap].count("Y")
        
        # Drop Test Physics Rules:
        # 1. Zero straps = FAIL on ALL 4 drop tests (MC 1-Drop, MC 10-Drop, SIOC 1-Drop, SIOC 17-Drop)
        # 2. Insufficient straps for heavy/top-heavy products = FAIL on 10-Drop & SIOC 17-Drop
        
        mc1_pass = True
        if strap_count == 0:
            mc1_pass = False
        elif weight > 600 and strap_count < 2:
            mc1_pass = False
        
        mc10_pass = True
        if not mc1_pass or strap_count == 0:
            mc10_pass = False
        elif head_strap == "N" and waist_strap == "N":
            mc10_pass = False
        elif cog == "Top-Heavy" and head_strap == "N":
            mc10_pass = False
        elif weight > 300 and waist_strap == "N":
            mc10_pass = False
        elif pose_complexity == "High" and strap_count < 2:
            mc10_pass = False

        sioc1_pass = mc1_pass
        
        sioc17_pass = True
        if not mc10_pass or strap_count == 0:
            sioc17_pass = False
        elif strap_count < 3 and weight > 200:
            sioc17_pass = False
        elif cog in ["Top-Heavy", "Back-Heavy"] and (head_strap == "N" or waist_strap == "N"):
            sioc17_pass = False
        elif num_accs > 3 and has_small_accs == "Y" and random.random() > 0.4:
            sioc17_pass = False

        failures = []
        if not mc10_pass or not sioc17_pass or not mc1_pass:
            if strap_count == 0:
                failures.append("Zero attachment straps applied (0-Point Setup) — Toy shifted completely out of cavity on initial drop impact")
            elif head_strap == "N" and waist_strap == "N":
                failures.append("Missing both Head & Waist restraints — severe internal displacement under Master Carton 10-drop")
            elif cog == "Top-Heavy" and head_strap == "N":
                failures.append("Head tilted > 20mm & neck joint stress observed during drops")
            elif weight > 250 and waist_strap == "N":
                failures.append("Waist shifted out of tray cavity")
            elif num_accs > 2 and has_small_accs == "Y":
                failures.append("Small accessory detached & loose in packaging window")
            elif pose_complexity == "High" and arm_strap == "N":
                failures.append("Extended limb rotated and scuffed plastic window")
            else:
                failures.append("Tray distortion & displacement under repeated drops")

        fail_str = "; ".join(failures) if failures else "-"
        
        row = (
            prod_name,
            weight,
            height,
            pose_complexity,
            cog,
            num_accs,
            has_small_accs,
            head_strap,
            waist_strap,
            arm_strap,
            leg_strap,
            "Pass" if mc1_pass else "Fail",
            "Pass" if mc10_pass else "Fail",
            "Pass" if sioc1_pass else "Fail",
            "Pass" if sioc17_pass else "Fail",
            fail_str
        )
        rows.append(row)

        json_data.append({
            "sku_id": sku_id,
            "product_name": prod_name,
            "category": category,
            "weight_g": weight,
            "height_cm": height,
            "pose_complexity": pose_complexity,
            "center_of_gravity": cog,
            "accessory_count": num_accs,
            "has_small_accessories": has_small_accs == "Y",
            "straps": {
                "head": head_strap == "Y",
                "waist": waist_strap == "Y",
                "arm": arm_strap == "Y",
                "leg": leg_strap == "Y",
            },
            "results": {
                "master_carton_1_drop": "Pass" if mc1_pass else "Fail",
                "master_carton_10_drop": "Pass" if mc10_pass else "Fail",
                "sioc_1_drop": "Pass" if sioc1_pass else "Fail",
                "sioc_17_drop": "Pass" if sioc17_pass else "Fail",
            },
            "failure_details": fail_str
        })
        
    return rows, json_data

def populate_all():
    template_path = "Drop_Test_Validation_Template.xlsx"
    output_excel = "Drop_Test_Validation_Dataset.xlsx"
    output_json = "Drop_Test_Validation_Dataset.json"
    
    data_rows, json_data = generate_50_samples()
    
    # 1. Excel (Try save, ignore if open in Excel app)
    try:
        wb = openpyxl.load_workbook(template_path)
        ws = wb["Drop Test Validation"]
        for r_idx, row in enumerate(data_rows, start=2):
            for c_idx, val in enumerate(row, start=1):
                ws.cell(row=r_idx, column=c_idx, value=val)
        wb.save(output_excel)
        print(f"Saved Excel dataset: {output_excel}")
    except PermissionError:
        print(f"[NOTE] '{output_excel}' is currently open in Excel. Updated JSON dataset successfully!")

    # 2. JSON
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(json_data, f, indent=2)
        
    print(f"Regenerated {len(data_rows)} rows successfully in {output_json}!")

if __name__ == "__main__":
    populate_all()
