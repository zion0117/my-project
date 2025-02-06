import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const StepTracker = () => {
  const [steps, setSteps] = useState("");
  const [data, setData] = useState([]);

  const addStepData = () => {
    if (!steps) return;
    const newEntry = { label: `Day ${data.length + 1}`, value: parseInt(steps) };
    setData([...data, newEntry]);
    setSteps("");
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter Steps:</Text>
      <TextInput
        value={steps}
        onChangeText={setSteps}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Add Steps" onPress={addStepData} />

      {data.length > 0 && (
        <LineChart
          data={{
            labels: data.map((entry) => entry.label),
            datasets: [{ data: data.map((entry) => entry.value) }],
          }}
          width={Dimensions.get("window").width - 40}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          bezier
          style={{ marginVertical: 10 }}
        />
      )}
    </View>
  );
};

export default StepTracker;
