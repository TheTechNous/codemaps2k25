package com.example.distancecalcshooliniuniv;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity2 extends AppCompatActivity {

    ImageButton bt;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main2);
        Toast.makeText(this, "Select Where Are You Know", Toast.LENGTH_SHORT).show();
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });


        }
        public void oneclick(View v){
            bt=findViewById(R.id.imageButton);
            int var_1=1;
            Intent i = new Intent(this,MainActivity3.class);
            i.putExtra("int_val1",var_1);
            startActivity(i);

        }
        public void onclick2(View v){
        bt=findViewById(R.id.imageButton2);
        int var_2=0;
        Intent i = new Intent(this,MainActivity3.class);
        i.putExtra("int_val2",var_2);
        startActivity(i);

        }
        public void onclick3(View v){
        bt = findViewById(R.id.imageButton3);
        int var_3=3;
        Intent i = new Intent(this,MainActivity3.class);
        i.putExtra("int_val3",var_3);
        startActivity(i);
        }
        public void onclick4(View v){
        bt = findViewById(R.id.imageButton5);
        int var_4=4;
        Intent i = new Intent(this,MainActivity3.class);
        i.putExtra("int_val4",var_4);
        startActivity(i);
        }
        public void onclick5(View v){
        bt = findViewById(R.id.imageButton6);
        int var_5 = 6;
        Intent i = new Intent(this, MainActivity3.class);
        i.putExtra("int_val5",var_5);
        startActivity(i);


        }
        public void onclick6(View v){
        bt = findViewById(R.id.imageButton7);
        int var_6=7;
        Intent i = new Intent(this, MainActivity3.class);
        i.putExtra("int_val6",var_6);
        startActivity(i);
        }
        public void onclick7(View v){
        bt = findViewById(R.id.imageButton9);
        int var_7=2;
        Intent i = new Intent(this,MainActivity3.class);
        i.putExtra("int_val7",var_7);
        startActivity(i);
        }
        public void onclick8(View v){
        bt = findViewById(R.id.imageButton11);
        int var_8=5;
        Intent i = new Intent(this,MainActivity3.class);
        i.putExtra("int_val8",var_8);
        startActivity(i);
        }


    }
