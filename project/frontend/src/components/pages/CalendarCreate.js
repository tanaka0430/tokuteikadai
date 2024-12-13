import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Header } from '../templates/Header';
import { useSetup } from '../hooks/useSetup';
import {
    Container,
    Grid,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Button,
    Typography,
    Paper,
    Box,
} from '@mui/material';

const CAMPUS = ["青山", "相模原"];
const DEPARTMENTS = [
    "指定なし", "青山スタンダード科目", "文学部共通", "文学部外国語科目", "英米文学科", "フランス文学科",
    "比較芸術学科", "教育人間　外国語科目", "教育人間　教育学科", "教育人間　心理学科", "経済学部",
    "法学部", "経営学部", "教職課程科目", "国際政治経済学部", "総合文化政策学部", "日本文学科",
    "史学科", "理工学部共通", "物理科学", "数理サイエンス", "物理・数理", "電気電子工学科",
    "機械創造", "経営システム", "情報テクノロジ－", "社会情報学部", "地球社会共生学部", "コミュニティ人間科学部",
    "化学・生命"
];
const SEMESTERS = [
    "指定なし", "前期", "通年", "後期", "後期前半", "後期後半", "通年隔１", "前期前半", "前期後半",
    "通年隔２", "前期集中", "夏休集中", "集中", "春休集中", "後期集中", "前期隔２", "前期隔１",
    "後期隔２", "後期隔１", "通年集中"
];

export const CalendarCreate = () => {
    const navigate = useNavigate();
    const { userId } = useSetup();

    const [formData, setFormData] = useState({
        calendar_name: '',
        campus: '',
        department: [],
        semester: '',
        sat_flag: false,
        sixth_period_flag: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "department") {
            setFormData((prev) => {
                const departments = prev.department.includes(value)
                    ? prev.department.filter((dep) => dep !== value)
                    : [...prev.department, value];
                return { ...prev, department: departments };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!userId) {
            alert('ユーザー情報が取得できませんでした。');
            return;
        }
    
        // リクエストボディの作成
        const requestBody = {
            id: 0, // カレンダー作成時はデフォルト値として 0 を設定
            user_id: userId, // ユーザー ID を設定
            calendar_name: formData.calendar_name.trim() || "", // 必須フィールド（空白をトリム）
            campus: formData.campus ? [formData.campus] : [], // 単一値をリストに変換
            semester: formData.semester ? [formData.semester] : [], // 単一値をリストに変換
            department: formData.department.length > 0 ? formData.department : [], // 空リスト対応
            sat_flag: Boolean(formData.sat_flag), // ブール値に変換
            sixth_period_flag: Boolean(formData.sixth_period_flag), // ブール値に変換
        };
    
        console.log('送信するリクエストボディ:', requestBody); // デバッグ用ログ
    
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/calendar/c-u/c`,
                requestBody, // リクエストボディ
                { headers: { "Content-Type": "application/json" }, withCredentials: true }
            );
            console.log('カレンダー作成成功:', response.data);
            navigate('/'); // 成功後にリダイレクト
        } catch (error) {
            console.error('カレンダー作成失敗:', error.response?.data || error);
    
            // APIからのエラー詳細を表示
            if (error.response?.data?.detail) {
                console.error('エラー詳細:', error.response.data.detail);
                alert(`カレンダー作成に失敗しました: ${error.response.data.detail.map(d => d.msg).join(', ')}`);
            } else {
                alert('カレンダー作成に失敗しました');
            }
        }
    };

    return (
        <Box>
            <Header />
            <Container maxWidth="lg" style={{ padding: '20px' }}>
                <form onSubmit={handleSubmit}>
                    <Paper style={{ padding: '20px' }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="カレンダー名"
                                    name="calendar_name"
                                    value={formData.calendar_name}
                                    onChange={handleChange}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>キャンパス</InputLabel>
                                    <Select
                                        name="campus"
                                        value={formData.campus}
                                        onChange={handleChange}
                                        label="キャンパス"
                                    >
                                        {CAMPUS.map((campus) => (
                                            <MenuItem key={campus} value={campus}>
                                                {campus}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>学期</InputLabel>
                                    <Select
                                        name="semester"
                                        value={formData.semester}
                                        onChange={handleChange}
                                        label="学期"
                                    >
                                        {SEMESTERS.map((semester) => (
                                            <MenuItem key={semester} value={semester}>
                                                {semester}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    学部
                                </Typography>
                                <FormGroup
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(5, 1fr)',
                                        gap: '10px',
                                    }}
                                >
                                    {DEPARTMENTS.map((department) => (
                                        <FormControlLabel
                                            key={department}
                                            control={
                                                <Checkbox
                                                    name="department"
                                                    value={department}
                                                    checked={formData.department.includes(department)}
                                                    onChange={handleChange}
                                                />
                                            }
                                            label={department}
                                        />
                                    ))}
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    オプション設定
                                </Typography>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="sat_flag"
                                                checked={formData.sat_flag}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="土曜授業"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                name="sixth_period_flag"
                                                checked={formData.sixth_period_flag}
                                                onChange={handleChange}
                                            />
                                        }
                                        label="6限目の有無"
                                    />
                                </FormGroup>
                            </Grid>
                            <Grid item xs={12} style={{ textAlign: 'center' }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{ width: '200px' }}
                                >
                                    作成
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </form>
            </Container>
        </Box>
    );
};
