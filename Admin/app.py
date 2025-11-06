from flask import Flask, render_template, request, redirect, url_for, flash
import mysql.connector

app = Flask(__name__)
app.secret_key = 'secret_key'

# ✅ Database Connection
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",             
        password="Rishika07@2005",  
        database="FARMER_DB"     
    )

# ---------------- LOGIN ----------------
@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        if username == 'admin' and password == 'admin123':
            return redirect(url_for('choose_action'))
        else:
            flash("❌ Invalid credentials! Try again.")
            return redirect(url_for('login'))
    return render_template('login.html')

# ---------------- CHOOSE ACTION PAGE ----------------
@app.route('/choose_action')
def choose_action():
    return render_template('choose_action.html')

# ---------------- UPDATE MSR ----------------
@app.route('/update_msr', methods=['GET', 'POST'])
def update_msr():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    cur.execute("SELECT DISTINCT crop_name FROM admin_price_variations")
    crops = cur.fetchall()

    selected_crop = None
    old_price = None

    if request.method == 'POST':
        crop_name = request.form['crop_name']

        # Fetch old MSR
        if 'fetch' in request.form:
            cur.execute("SELECT min_price FROM admin_price_variations WHERE crop_name = %s", (crop_name,))
            result = cur.fetchone()
            if result:
                selected_crop = crop_name
                old_price = result['min_price']

        # Update MSR
        elif 'update' in request.form:
            new_price = request.form['new_price']
            cur.execute("UPDATE admin_price_variations SET min_price = %s WHERE crop_name = %s", (new_price, crop_name))
            conn.commit()
            flash(f"✅ MSR updated for {crop_name}")
            return redirect(url_for('choose_action'))

    cur.close()
    conn.close()
    return render_template('update_msr.html', crops=crops, selected_crop=selected_crop, old_price=old_price)

# ---------------- UPDATE CAPACITY ----------------
@app.route('/update_capacity', methods=['GET', 'POST'])
def update_capacity():
    conn = get_db_connection()
    cur = conn.cursor(dictionary=True)

    # ✅ Fetch all mandi names
    cur.execute("SELECT DISTINCT mandi_name FROM capacity")
    mandis = cur.fetchall()

    # ✅ Fetch all crops (show crop_name but use crop_id internally)
    cur.execute("SELECT crop_id, crop_name FROM admin_price_variations")
    crops = cur.fetchall()

    old_capacity = None
    selected_crop = None
    selected_mandi = None

    if request.method == 'POST':
        mandi_name = request.form['mandi_name']
        crop_id = request.form['crop_id']

        # ✅ Fetch existing capacity
        if 'fetch' in request.form:
            cur.execute("SELECT max_capacity FROM capacity WHERE mandi_name = %s AND crop_id = %s", (mandi_name, crop_id))
            result = cur.fetchone()
            if result:
                selected_crop = crop_id
                selected_mandi = mandi_name
                old_capacity = result['max_capacity']
            else:
                flash("❌ No record found for this combination.")

        # ✅ Update capacity
        elif 'update' in request.form:
            new_capacity = request.form['new_capacity']
            cur.execute("UPDATE capacity SET max_capacity = %s WHERE mandi_name = %s AND crop_id = %s",
                        (new_capacity, mandi_name, crop_id))
            conn.commit()
            flash(f"✅ Capacity updated for {mandi_name} (Crop ID: {crop_id})")
            return redirect(url_for('choose_action'))

    cur.close()
    conn.close()
    return render_template('update_capacity.html',
                           mandis=mandis,
                           crops=crops,
                           old_capacity=old_capacity,
                           selected_crop=selected_crop,
                           selected_mandi=selected_mandi)


if __name__ == "__main__":
    app.run(debug=True)
