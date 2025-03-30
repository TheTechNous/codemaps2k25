package com.example.distancecalcshooliniuniv;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends AppCompatActivity {
    public int a=9;
    Button button1;
    EditText username;
    EditText passwd;
     Button button;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main);
//        button1=findViewById(R.id.button);
        username=findViewById(R.id.editTextText);
        passwd=findViewById(R.id.editTextText2);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }
    public void onclick(View v){
//        Toast.makeText(this, "Developed By Hushed Coders ", Toast.LENGTH_SHORT).show();
        button = findViewById(R.id.button5);
        Intent i = new Intent(this, MainActivity2.class);
        startActivity(i);

    }
    public void onclick2(View v){
        button1=findViewById(R.id.button);
      String usernamef=username.getText().toString();
      String passwordf=passwd.getText().toString();
      if(usernamef.equals("hushed coders")&&passwordf.equals("shooliniuniversity")){
          Intent i=new Intent(this, MainActivity5.class);
          startActivity(i);


      }
    }
}