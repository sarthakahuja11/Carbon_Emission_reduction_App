package com.example.carbonemission1;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Button;
import android.content.Intent;
import android.view.View;

public class mainscreen extends AppCompatActivity {

    public Button button;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mainscreen);

        button = (Button) findViewById(R.id.signinbtn);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(mainscreen.this, signupscreen.class);
                startActivity(intent);
            }
        });

        button = (Button) findViewById(R.id.logbtn);

        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(mainscreen.this, loginscreen.class);
                startActivity(intent);
            }
        });

    }
}