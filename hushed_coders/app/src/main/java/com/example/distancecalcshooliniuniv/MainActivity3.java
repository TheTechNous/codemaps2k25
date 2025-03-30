package com.example.distancecalcshooliniuniv;

import android.content.Intent;
import android.os.Bundle;
import android.provider.Settings;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity3 extends AppCompatActivity {

    ImageButton bt;
    int src1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_main3);
        int f1=0;
        Intent i = getIntent();
        int  a_block=i.getIntExtra("int_val1",f1);
        int f2=0;
        int agri_block=i.getIntExtra("int_val2",f2);
        int f3=0;
        int c_block=i.getIntExtra("int_val3",f3);
        int f4=0;
        int d_e_block=i.getIntExtra("int_val4",f4);
        int f5=0;
        int g_h_block=i.getIntExtra("int_val5",f5);
        int f6=0;
        int lib= i.getIntExtra("int_val6",f6);
        int f7=0;
        int ai_block= i.getIntExtra("int_val7",f7);
        int f8=0;
        int oat=i.getIntExtra("int_val8",f8);
        if(a_block!=0){
            src1=a_block;
        }
        if(agri_block!=0){
            src1=agri_block;
        }
        if(c_block!=0){
            src1=c_block;
        }
        if(d_e_block!=0){
            src1=d_e_block;
        }
        if(g_h_block!=0){
            src1=g_h_block;
        }
        if(lib!=0){
            src1=lib;
        }
        if(ai_block!=0){
            src1=ai_block;
        }
        if(oat!=0){
            src1=oat;
        }

//
//        Intent in  =new Intent(this,MainActivity4.class);
//            in.putExtra("Src_a",src1);
//        startActivity(in);
//        Intent in2=new Intent(this,MainActivity4.class);
//        in2.putExtra("agri_block1",agri_block);
//        startActivity(in2);
//        in.putExtra("agri_block1",agri_block);
//        startActivity(in);
//        in.putExtra("c_block1",c_block);
//        startActivity(in);
//        in.putExtra("d_e_block1",d_e_block);
//        startActivity(in);
//        in.putExtra("g_h_block1",g_h_block);
//        startActivity(in);
//        in.putExtra("lib1",lib);
//        startActivity(in);
//        in.putExtra("ai_block1",ai_block);
//        startActivity(in);
//        in.putExtra("oat1",oat);
//        startActivity(in);





        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }
    public void onclick11(View v){
        bt=findViewById(R.id.imageButton);
        int ff=1;
        Intent y= new Intent(this,MainActivity4.class);
        y.putExtra("a",ff);
        y.putExtra("src_a",src1);
        startActivity(y);


    }
    public void onclick22(View v){
        bt=findViewById(R.id.imageButton2);
        int fg=0;
        Intent y= new Intent(this, MainActivity4.class);
        y.putExtra("b",fg);
        y.putExtra("src_b",src1);
        startActivity(y);
    }
    public void onclick33(View v){
        bt=findViewById(R.id.imageButton3);
        int fh=3;
        Intent y= new Intent(this,MainActivity4.class);
        y.putExtra("c",fh);
        y.putExtra("src_c",src1);
        startActivity(y);
    }
    public void onclick44(View v){
        bt=findViewById(R.id.imageButton5);
        int fi=4;
        Intent y= new Intent(this, MainActivity4.class);
        y.putExtra("d",fi);
        y.putExtra("src_d",src1);
        startActivity(y);
    }
    public void onclick55(View v){
        bt=findViewById(R.id.imageButton6);
        int fj=6;
        Intent y = new Intent(this,MainActivity4.class);
        y.putExtra("e",fj);
        y.putExtra("src_e",src1);
        startActivity(y);
    }
    public void onclick66(View v){
        bt=findViewById(R.id.imageButton7);
        int fk=7;
        Intent y= new Intent(this, MainActivity4.class);
        y.putExtra("f",fk);
        y.putExtra("src_f",src1);
        startActivity(y);
    }
    public void onclick77(View v){
        bt=findViewById(R.id.imageButton9);
        int fl=2;
        Intent y = new Intent(this,MainActivity4.class);
        y.putExtra("g",fl);
        y.putExtra("src_g",src1);
        startActivity(y);
    }
    public void onclick88(View v){
        bt=findViewById(R.id.imageButton11);
        int fm=5;
        Intent y= new Intent(this , MainActivity4.class);
        y.putExtra("h",fm);
        y.putExtra("src_h",src1);
        startActivity(y);
    }


}