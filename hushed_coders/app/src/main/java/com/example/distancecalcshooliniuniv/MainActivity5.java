package com.example.distancecalcshooliniuniv;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity5 extends AppCompatActivity {
    TextView t;
    EditText ed;
    EditText edt;
    Button bt;
    int flag_block=0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main5);
        t=findViewById(R.id.textView15);
        bt=findViewById(R.id.button2);





        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }
    public void onclick(View v){
        flag_block=1;
        ed=findViewById(R.id.editTextNumber);
        edt=findViewById(R.id.editTextNumber2);
        String s1;
        String s2;
        s1=ed.getText().toString();
        s2=edt.getText().toString();
        int a;
        int b;
        a=Integer.parseInt(s1);
        b=Integer.parseInt(s2);
        Intent i = new Intent(this,MainActivity4.class);
        i.putExtra("val_1",a);
        i.putExtra("val_2",b);
        startActivity(i);

    }

}