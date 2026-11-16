import React, { useState } from "react";
import {
  Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const COLORS = {
  blue: "#004587",
  orange: "#F68B1F",
  ink: "#172033",
  muted: "#64748B",
  line: "#DCE4EF",
  background: "#F2F5F9",
  white: "#FFFFFF",
  green: "#168653",
  red: "#B42318",
};

export const UNITS = [
  "Senac 903 Sul (Faculdade Senac DF)",
  "Senac Jessé Freire (SCS)",
  "Senac Taguatinga",
  "Senac Ceilândia",
  "Senac Gama",
  "Senac Sobradinho",
  "Senac Santa Maria",
  "Senac Guará",
];
export const CATEGORIES = ["Hardware", "Rede", "Multimídia", "Software"];
export const PRESENCES = ["Online", "Em Atendimento", "Ausente"];

export function Page({ children, scroll = true }) {
  const content = scroll
    ? <ScrollView contentContainerStyle={styles.pageContent} keyboardShouldPersistTaps="handled">{children}</ScrollView>
    : <View style={styles.pageContent}>{children}</View>;
  return <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>{content}</SafeAreaView>;
}

export function BrandHeader({ subtitle = "Suporte de tecnologia" }) {
  return (
    <View style={styles.brand}>
      <Image source={require("../assets/senac-logo.png")} style={styles.logo} resizeMode="contain" />
      <View>
        <Text style={styles.brandTitle}>ConectaTI</Text>
        <Text style={styles.brandSub}>{subtitle}</Text>
      </View>
    </View>
  );
}

export function Title({ title, subtitle }) {
  return (
    <View style={styles.titleWrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ title, onPress, variant = "primary", disabled = false, style }) {
  const secondary = variant === "secondary";
  const danger = variant === "danger";
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.buttonSecondary,
        danger && styles.buttonDanger,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={[styles.buttonText, secondary && styles.buttonSecondaryText]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, multiline, autoCapitalize, editable = true, autoComplete }) {
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        autoCapitalize={autoCapitalize || "sentences"}
        editable={editable}
        autoComplete={autoComplete}
        style={[styles.input, multiline && styles.multiline, !editable && styles.inputDisabled]}
      />
    </View>
  );
}

export function SelectField({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.fieldWrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={styles.select} onPress={() => setOpen(true)} accessibilityRole="button">
        <Text style={styles.selectText} numberOfLines={2}>{value}</Text>
        <Text style={styles.selectArrow}>Selecionar</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label || "Selecionar opção"}</Text>
            <ScrollView>
              {options.map((option) => (
                <Pressable key={option.value ?? option} style={styles.option} onPress={() => {
                  onChange(option.value ?? option);
                  setOpen(false);
                }}>
                  <Text style={[styles.optionText, (option.value ?? option) === value && styles.optionSelected]}>{option.label ?? option}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Button title="Cancelar" variant="secondary" onPress={() => setOpen(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export function Chip({ title, active, onPress, tone = "blue" }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && (tone === "orange" ? styles.chipOrange : styles.chipActive)]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{title}</Text>
    </Pressable>
  );
}

export function Notice({ children, tone = "warning" }) {
  return <View style={[styles.notice, tone === "error" && styles.noticeError]}><Text style={styles.noticeText}>{children}</Text></View>;
}

export function ErrorText({ children }) {
  return children ? <Text accessibilityRole="alert" style={styles.error}>{children}</Text> : null;
}

export function ModalForm({ visible, title, onClose, children }) {
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalPage} edges={["top", "bottom"]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <Pressable onPress={onClose} accessibilityRole="button"><Text style={styles.closeText}>Fechar</Text></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">{children}</ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "TI";
  return `${parts[0][0]}${parts.length > 1 ? parts[parts.length - 1][0] : ""}`.toUpperCase();
}

export function errorMessage(error) {
  return error instanceof Error ? error.message : "Não foi possível concluir a operação.";
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  pageContent: { padding: 16, paddingBottom: 28, gap: 12 },
  brand: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 8 },
  logo: { width: 62, height: 38, backgroundColor: COLORS.white, borderRadius: 6 },
  brandTitle: { color: COLORS.blue, fontWeight: "800", fontSize: 18 },
  brandSub: { color: COLORS.muted, fontSize: 12, marginTop: 1 },
  titleWrap: { gap: 3, marginBottom: 2 },
  title: { color: COLORS.blue, fontSize: 23, fontWeight: "800" },
  subtitle: { color: COLORS.muted, fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, padding: 15, gap: 8 },
  button: { minHeight: 46, paddingHorizontal: 16, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.blue },
  buttonSecondary: { backgroundColor: COLORS.white, borderColor: COLORS.line, borderWidth: 1 },
  buttonDanger: { backgroundColor: COLORS.red },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.82 },
  buttonText: { color: COLORS.white, fontWeight: "700", fontSize: 14, textAlign: "center" },
  buttonSecondaryText: { color: COLORS.blue },
  fieldWrap: { gap: 6, marginBottom: 5 },
  label: { color: COLORS.ink, fontSize: 13, fontWeight: "700" },
  input: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, paddingHorizontal: 13, paddingVertical: 11, color: COLORS.ink, fontSize: 15 },
  inputDisabled: { backgroundColor: "#F1F5F9", color: COLORS.muted },
  multiline: { minHeight: 96, textAlignVertical: "top" },
  select: { minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: COLORS.line, backgroundColor: COLORS.white, paddingHorizontal: 13, paddingVertical: 10, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  selectText: { color: COLORS.ink, flex: 1, fontSize: 14 },
  selectArrow: { color: COLORS.blue, fontSize: 11, fontWeight: "700" },
  modalBackdrop: { flex: 1, backgroundColor: "#0007", justifyContent: "flex-end" },
  sheet: { maxHeight: "78%", backgroundColor: COLORS.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, gap: 10 },
  sheetTitle: { fontSize: 18, fontWeight: "800", color: COLORS.ink, marginBottom: 4 },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.line },
  optionText: { color: COLORS.ink, fontSize: 15 },
  optionSelected: { color: COLORS.blue, fontWeight: "800" },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.line },
  chipActive: { backgroundColor: COLORS.blue, borderColor: COLORS.blue },
  chipOrange: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  chipText: { color: COLORS.muted, fontSize: 12, fontWeight: "700" },
  chipTextActive: { color: COLORS.white },
  notice: { borderRadius: 12, backgroundColor: "#FFF7E6", borderColor: "#F2D59B", borderWidth: 1, padding: 12 },
  noticeError: { backgroundColor: "#FEF3F2", borderColor: "#FDA29B" },
  noticeText: { fontSize: 12, color: "#7A4A00", lineHeight: 18 },
  error: { color: COLORS.red, fontSize: 13, lineHeight: 18 },
  modalPage: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { minHeight: 58, paddingHorizontal: 18, borderBottomColor: COLORS.line, borderBottomWidth: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: 18, fontWeight: "800", color: COLORS.blue },
  closeText: { color: COLORS.blue, fontWeight: "700", padding: 8 },
  modalContent: { padding: 18, paddingBottom: 36, gap: 9 },
});
